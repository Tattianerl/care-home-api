import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class CreateEvolutionController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const { descricao, patientId } = request.body;

      if (
        typeof patientId !== "string" ||
        !patientId.trim()
      ) {
        return response.status(400).json({
          error: "ID do paciente é obrigatório.",
        });
      }

      if (
        typeof descricao !== "string" ||
        !descricao.trim()
      ) {
        return response.status(400).json({
          error: "Descrição da evolução é obrigatória.",
        });
      }

      const normalizedPatientId = patientId.trim();
      const normalizedDescricao = descricao.trim();

      const patient = await prisma.patient.findUnique({
        where: {
          id: normalizedPatientId,
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
            "Não é possível registrar evolução para paciente inativo.",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          nome: true,
          cargo: true,
          assinatura: true,
        },
      });

      if (!user) {
        return response.status(401).json({
          error: "Usuário autenticado não encontrado.",
        });
      }

      const evolution = await prisma.evolution.create({
        data: {
          descricao: normalizedDescricao,
          assinatura: user.assinatura ?? null,
          patientId: normalizedPatientId,
          userId: user.id,
        },
      });

      await createAuditLog({
        userId,
        acao: AuditActions.CREATE,
        entidade: "EVOLUTION",
        entidadeId: evolution.id,
        descricao:
          `Nova evolução registrada por "${user.nome}" ` +
          `para o paciente "${patient.nome}".`,
      });

      return response.status(201).json(evolution);
    } catch (error) {
      console.error("Erro ao registrar evolução:", error);

      return response.status(500).json({
        error: "Erro ao registrar evolução.",
      });
    }
  }
}