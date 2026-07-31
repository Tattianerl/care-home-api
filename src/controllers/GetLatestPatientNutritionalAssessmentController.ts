import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetLatestPatientNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    try {
      const patientId = String(request.params.id);

      const latestAssessment = await prisma.nutritionalAssessment.findFirst({
        where: { patientId },
        include: {
          user: {
            select: {
              nome: true,
              cargo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return response.json(latestAssessment || null);
    } catch (error) {
      console.error("Erro ao buscar última avaliação nutricional:", error);
      return response.status(500).json({
        error: "Erro ao buscar última avaliação nutricional",
      });
    }
  }
}