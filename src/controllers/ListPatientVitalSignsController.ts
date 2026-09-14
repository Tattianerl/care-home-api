import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientVitalSignsController {
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

      const {
        startDate,
        endDate,
        limit,
      } = request.query;

      const whereCondition: {
        patientId: string;
        createdAt?: {
          gte?: Date;
          lte?: Date;
        };
      } = {
        patientId,
      };

      if (startDate || endDate) {
        whereCondition.createdAt = {};

        if (startDate) {
          const start = new Date(String(startDate));

          if (Number.isNaN(start.getTime())) {
            return response.status(400).json({
              error: "Data inicial inválida.",
            });
          }

          start.setHours(0, 0, 0, 0);
          whereCondition.createdAt.gte = start;
        }

        if (endDate) {
          const end = new Date(String(endDate));

          if (Number.isNaN(end.getTime())) {
            return response.status(400).json({
              error: "Data final inválida.",
            });
          }

          end.setHours(23, 59, 59, 999);
          whereCondition.createdAt.lte = end;
        }
      }

      let take: number | undefined;

      if (limit !== undefined) {
        const parsedLimit = Number(limit);

        if (
          !Number.isInteger(parsedLimit) ||
          parsedLimit <= 0
        ) {
          return response.status(400).json({
            error: "Limite inválido.",
          });
        }

        take = Math.min(parsedLimit, 100);
      }

      const vitalSigns = await prisma.vitalSign.findMany({
        where: whereCondition,
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
        take,
      });

      const data = vitalSigns.map((item) => ({
        ...item,
        pressao: `${item.pressaoSistolica}/${item.pressaoDiastolica}`,
      }));

      return response.status(200).json(data);
    } catch (error) {
      console.error(
        "Erro ao listar sinais vitais do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro ao listar sinais vitais do paciente.",
      });
    }
  }
}

