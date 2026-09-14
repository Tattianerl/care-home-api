import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetTodayNutritionalAssessmentsController {
  async handle(request: Request, response: Response) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const startOfNextDay = new Date(startOfDay);
      startOfNextDay.setDate(startOfNextDay.getDate() + 1);

      const assessments =
        await prisma.nutritionalAssessment.findMany({
          where: {
            createdAt: {
              gte: startOfDay,
              lt: startOfNextDay,
            },
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
          orderBy: {
            createdAt: "desc",
          },
        });

      return response.status(200).json(assessments);
    } catch (error) {
      console.error(
        "Erro ao buscar avaliações nutricionais de hoje:",
        error
      );

      return response.status(500).json({
        error: "Erro ao buscar avaliações nutricionais de hoje.",
      });
    }
  }
}