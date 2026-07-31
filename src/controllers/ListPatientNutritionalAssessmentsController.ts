import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientNutritionalAssessmentsController {
  async handle(request: Request, response: Response) {
    try {
      const  patientId = String(request.params.id);

      if (!patientId) {
        return response.status(400).json({
          error: "ID do paciente não foi fornecido.",
        });
      }

      // Opcional: Verificar se o paciente existe antes de buscar
      const patientExists = await prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patientExists) {
        return response.status(404).json({
          error: "Paciente não encontrado",
        });
      }

      const assessments = await prisma.nutritionalAssessment.findMany({
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
    } catch (error) {
      console.error("Erro ao listar avaliações nutricionais:", error);
      return response.status(500).json({
        error: "Erro interno do servidor ao buscar avaliações nutricionais",
      });
    }
  }
}