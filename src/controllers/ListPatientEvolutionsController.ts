import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientEvolutionsController {
  async handle(request: Request, response: Response) {
    const { id: patientId } = request.params;

    if (!patientId || Array.isArray(patientId)) {
      return response.status(400).json({
        error: "ID do paciente inválido.",
      });
    }

    try {
      const patient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
        select: {
          id: true,
          nome: true,
        },
      });

      if (!patient) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      const evolutions = await prisma.evolution.findMany({
        where: {
          patientId,
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
              assinatura: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return response.status(200).json({
        patient,
        total: evolutions.length,
        evolutions,
      });
    } catch (error) {
      console.error(
        "Erro ao listar evoluções do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro ao listar evoluções do paciente.",
      });
    }
  }
}