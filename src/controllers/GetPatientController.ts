import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetPatientController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id || Array.isArray(id)) {
        return response.status(400).json({
          error: "ID do paciente inválido.",
        });
      }

      const patient = await prisma.patient.findUnique({
        where: {
          id,
        },
        include: {
          evolutions: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: {
                select: {
                  id: true,
                  nome: true,
                  cargo: true,
                  registroProfissional: true,
                },
              },
            },
          },
        },
      });

      if (!patient) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      return response.status(200).json(patient);
    } catch (error) {
      console.error("Erro ao buscar paciente:", error);

      return response.status(500).json({
        error: "Erro ao buscar paciente.",
      });
    }
  }
}