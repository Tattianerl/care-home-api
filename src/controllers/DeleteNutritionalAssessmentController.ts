import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DeleteNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    const assessmentId = String(request.params.id);

    const assessment = await prisma.nutritionalAssessment.findUnique({
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

    if (!assessment) {
      return response.status(404).json({
        error: "Avaliação nutricional não encontrada.",
      });
    }

    return response.status(409).json({
      error: "Exclusão de avaliação nutricional não permitida",
      message:
        "Avaliações nutricionais não podem ser excluídas fisicamente. Para corrigir uma informação, utilize o procedimento de correção ou adendo definido pela instituição.",
    });
  }
}