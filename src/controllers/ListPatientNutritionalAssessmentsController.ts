import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientNutritionalAssessmentsController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const assessments =
      await prisma.nutritionalAssessment.findMany({
        where: {
          patientId,
        },
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

    return response.json(assessments);
  }
}