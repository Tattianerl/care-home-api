import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";

export class DeleteNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    const assessmentId = String(request.params.id ?? "").trim();
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    if (!assessmentId) {
      return response.status(400).json({
        error: "ID da avaliação nutricional é obrigatório.",
      });
    }

    try {
      const assessment =
        await prisma.nutritionalAssessment.findUnique({
          where: {
            id: assessmentId,
          },
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

      if (!assessment) {
        return response.status(404).json({
          error: "Avaliação nutricional não encontrada.",
        });
      }

      if (assessment.deletedAt) {
        return response.status(409).json({
          error: "Avaliação nutricional já foi excluída.",
        });
      }

      await prisma.nutritionalAssessment.update({
        where: {
          id: assessmentId,
        },
        data: {
          deletedAt: new Date(),
          deletedByUserId: userId,
        },
      });

      await createAuditLog({
        userId,
        acao: "DELETE",
        entidade: "NUTRITIONAL_ASSESSMENT",
        entidadeId: assessmentId,
        descricao:
          `Avaliação nutricional do residente ` +
          `"${assessment.patient.nome}" excluída ` +
          `logicamente pelo coordenador.`,
      });

      return response.status(204).send();
    } catch (error) {
      console.error(
        "Erro ao excluir avaliação nutricional:",
        error
      );

      return response.status(500).json({
        error: "Erro ao excluir avaliação nutricional.",
      });
    }
  }
}
