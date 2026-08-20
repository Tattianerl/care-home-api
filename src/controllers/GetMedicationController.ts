import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class GetMedicationController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id || Array.isArray(id) || !uuidPattern.test(id)) {
        return response.status(400).json({
          error: "ID da medicação inválido.",
        });
      }

      const medication = await prisma.medication.findUnique({
        where: { id },
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
          prescritoPor: {
            select: {
              id: true,
              nome: true,
              cargo: true,
            },
          },
        },
      });

      if (!medication) {
        return response.status(404).json({
          error: "Medicação não encontrada.",
        });
      }

      return response.status(200).json(medication);
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        error: "Erro ao buscar medicação.",
      });
    }
  }
}
