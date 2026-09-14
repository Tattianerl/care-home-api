import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientNutritionalAssessmentsController {
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

      const assessments =
        await prisma.nutritionalAssessment.findMany({
          where: {
            patientId: patient.id,
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

      return response.status(200).json(assessments);
    } catch (error) {
      console.error(
        "Erro ao listar avaliações nutricionais:",
        error
      );

      return response.status(500).json({
        error: "Erro ao buscar avaliações nutricionais.",
      });
    }
  }
}