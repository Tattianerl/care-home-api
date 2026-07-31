import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DeleteNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    try {
      const assessmentId = String(request.params.id);

      const assessmentExists = await prisma.nutritionalAssessment.findUnique({
        where: { id: assessmentId },
      });

      if (!assessmentExists) {
        return response.status(404).json({
          error: "Avaliação nutricional não encontrada.",
        });
      }

      await prisma.nutritionalAssessment.delete({
        where: { id: assessmentId },
      });

      return response.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar avaliação nutricional:", error);
      return response.status(500).json({
        error: "Erro ao deletar avaliação nutricional",
      });
    }
  }
}