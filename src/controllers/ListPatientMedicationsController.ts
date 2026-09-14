import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientMedicationsController {
  async handle(request: Request, response: Response) {
    try {
      const patientId = request.params.id;

      if (!patientId || Array.isArray(patientId)) {
        return response.status(400).json({
          error: "ID do paciente inválido.",
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

      const medications = await prisma.medication.findMany({
        where: {
          patientId,
        },
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              cargo: true,
            },
          },
          prescritoPor: {
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

      return response.status(200).json(medications);
    } catch (error) {
      console.error(
        "Erro ao listar medicações do paciente:",
        error,
      );

      return response.status(500).json({
        error: "Erro ao listar medicações do paciente.",
      });
    }
  }
}

