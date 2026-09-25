import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetLatestPatientNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    try {
      const patientId = String(request.params.id ?? "").trim();

      if (!patientId) {
        return response.status(400).json({
          error: "ID do paciente é obrigatório.",
        });
      }

      const patient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
        select: {
          id: true,
        },
      });

      if (!patient) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      const latestAssessment =
        await prisma.nutritionalAssessment.findFirst({
          where: {
            patientId: patient.id,
            deletedAt: null,
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

      return response.status(200).json(latestAssessment);
    } catch (error) {
      console.error(
        "Erro ao buscar última avaliação nutricional:",
        error
      );

      return response.status(500).json({
        error: "Erro ao buscar última avaliação nutricional.",
      });
    }
  }
}
