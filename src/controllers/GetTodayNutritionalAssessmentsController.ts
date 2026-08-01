// src/controllers/GetTodayNutritionalAssessmentsController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetTodayNutritionalAssessmentsController {
  async handle(request: Request, response: Response) {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const avaliacoes = await prisma.nutritionalAssessment.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
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

    return response.status(200).json(avaliacoes);
  }
}