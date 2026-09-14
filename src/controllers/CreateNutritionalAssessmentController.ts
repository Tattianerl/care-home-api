import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class CreateNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const {
        peso,
        altura,
        observacoes,
        patientId,
      } = request.body;

      if (
        typeof patientId !== "string" ||
        !patientId.trim()
      ) {
        return response.status(400).json({
          error: "ID do paciente é obrigatório.",
        });
      }

      if (peso === undefined || altura === undefined) {
        return response.status(400).json({
          error: "Peso e altura são obrigatórios.",
        });
      }

      const numPeso = Number(peso);
      const numAltura = Number(altura);

      if (
        !Number.isFinite(numPeso) ||
        !Number.isFinite(numAltura)
      ) {
        return response.status(400).json({
          error: "Peso e altura devem ser valores numéricos.",
        });
      }

      // O sistema utiliza altura em metros.
      if (numPeso <= 0 || numPeso > 500) {
        return response.status(400).json({
          error: "Peso inválido.",
        });
      }

      if (numAltura <= 0 || numAltura > 2.5) {
        return response.status(400).json({
          error: "Altura inválida. Informe a altura em metros.",
        });
      }

      if (
        observacoes !== undefined &&
        observacoes !== null &&
        typeof observacoes !== "string"
      ) {
        return response.status(400).json({
          error: "Observações inválidas.",
        });
      }

      const patient = await prisma.patient.findUnique({
        where: {
          id: patientId.trim(),
        },
        select: {
          id: true,
          nome: true,
          ativo: true,
        },
      });

      if (!patient) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      if (!patient.ativo) {
        return response.status(409).json({
          error:
            "Não é possível registrar avaliação nutricional para paciente inativo.",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        return response.status(401).json({
          error: "Usuário autenticado não encontrado.",
        });
      }

      const imc = Number(
        (numPeso / (numAltura * numAltura)).toFixed(2)
      );

      const assessment =
        await prisma.nutritionalAssessment.create({
          data: {
            peso: numPeso,
            altura: numAltura,
            imc,
            observacoes:
              typeof observacoes === "string" &&
              observacoes.trim()
                ? observacoes.trim()
                : null,
            patientId: patient.id,
            userId: user.id,
          },
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                cargo: true,
              },
            },
          },
        });

      await createAuditLog({
        userId,
        acao: AuditActions.CREATE,
        entidade: "NUTRITIONAL_ASSESSMENT",
        entidadeId: assessment.id,
        descricao:
          `Avaliação nutricional registrada para o paciente ` +
          `"${patient.nome}".`,
      });

      return response.status(201).json(assessment);
    } catch (error) {
      console.error(
        "Erro ao criar avaliação nutricional:",
        error
      );

      return response.status(500).json({
        error: "Erro ao criar avaliação nutricional.",
      });
    }
  }
}