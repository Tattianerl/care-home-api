import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";

export class UpdateNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    try {
      const assessmentId = String(request.params.id);
      const { peso, altura, observacoes } = request.body;

      const assessmentExists =
        await prisma.nutritionalAssessment.findUnique({
          where: { id: assessmentId },
          include: {
            patient: {
              select: {
                id: true,
                nome: true,
              },
            },
            user: {
              select: {
                id: true,
                nome: true,
                cargo: true,
              },
            },
          },
        });

      if (!assessmentExists) {
        return response.status(404).json({
          error: "Avaliação nutricional não encontrada.",
        });
      }

      if (assessmentExists.deletedAt) {
        return response.status(409).json({
          error:
            "Não é possível editar uma avaliação nutricional excluída.",
        });
      }

      const dataToUpdate: {
        peso?: number;
        altura?: number;
        imc?: number;
        observacoes?: string | null;
      } = {};

      if (observacoes !== undefined) {
        dataToUpdate.observacoes =
          observacoes === null
            ? null
            : String(observacoes).trim();
      }

      const pesoInformado =
        peso !== undefined && peso !== null;

      const alturaInformada =
        altura !== undefined && altura !== null;

      if (pesoInformado || alturaInformada) {
        const newPeso = pesoInformado
          ? Number(peso)
          : assessmentExists.peso;

        let newAltura = alturaInformada
          ? Number(altura)
          : assessmentExists.altura;

        if (!Number.isFinite(newPeso) || newPeso <= 0) {
          return response.status(400).json({
            error: "Peso inválido.",
          });
        }

        if (!Number.isFinite(newAltura) || newAltura <= 0) {
          return response.status(400).json({
            error: "Altura inválida.",
          });
        }

        // Aceita altura em centímetros ou metros,
        // mantendo o mesmo comportamento do cadastro.
        if (newAltura > 3) {
          newAltura = newAltura / 100;
        }

        if (newAltura <= 0 || newAltura > 3) {
          return response.status(400).json({
            error: "Altura inválida.",
          });
        }

        const imc = Number(
          (newPeso / (newAltura * newAltura)).toFixed(2)
        );

        dataToUpdate.peso = newPeso;
        dataToUpdate.altura = newAltura;
        dataToUpdate.imc = imc;
      }

      if (Object.keys(dataToUpdate).length === 0) {
        return response.status(400).json({
          error: "Nenhum dado válido para atualização.",
        });
      }

      const updatedAssessment =
        await prisma.nutritionalAssessment.update({
          where: {
            id: assessmentId,
          },
          data: dataToUpdate,
          include: {
            user: {
              select: {
                nome: true,
                cargo: true,
              },
            },
          },
        });

      await createAuditLog({
        userId: request.user!.id,
        acao: "UPDATE",
        entidade: "NUTRITIONAL_ASSESSMENT",
        entidadeId: assessmentId,
        descricao:
          `Avaliação nutricional do residente ` +
          `"${assessmentExists.patient.nome}" atualizada.`,
      });

      return response.json(updatedAssessment);
    } catch (error) {
      console.error(
        "Erro ao atualizar avaliação nutricional:",
        error
      );

      return response.status(500).json({
        error: "Erro ao atualizar avaliação nutricional",
      });
    }
  }
}
