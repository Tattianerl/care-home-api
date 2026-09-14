import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetLatestVitalSignController {
  async handle(
    request: Request<{ id: string }>,
    response: Response
  ) {
    try {
      const patientId = String(request.params.id);

      if (!patientId) {
        return response.status(400).json({
          error: "ID do paciente é obrigatório.",
        });
      }

      const patientExists = await prisma.patient.findUnique({
        where: { id: patientId },
        select: { id: true },
      });

      if (!patientExists) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      const latestVitalSign = await prisma.vitalSign.findFirst({
        where: {
          patientId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              nome: true,
              cargo: true,
            },
          },
        },
      });

      if (!latestVitalSign) {
        return response.status(404).json({
          error: "Nenhum sinal vital registrado.",
        });
      }

      return response.status(200).json({
        ...latestVitalSign,
        pressao: `${latestVitalSign.pressaoSistolica}/${latestVitalSign.pressaoDiastolica}`,
      });
    } catch (error) {
      console.error(
        "Erro ao buscar último sinal vital:",
        error
      );

      return response.status(500).json({
        error: "Erro ao buscar último sinal vital.",
      });
    }
  }
}

