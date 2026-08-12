import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientVitalSignsController {
  async handle(
    request: Request<{ id: string }>,
    response: Response
  ) {
    const patientId = request.params.id;

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
        whereCondition.createdAt.gte =
          new Date(String(startDate));
      }

      if (endDate) {
        const end = new Date(String(endDate));

        end.setHours(23, 59, 59, 999);

        whereCondition.createdAt.lte = end;
      }
    }

    let take: number | undefined;

    if (limit) {
      const parsedLimit = Number(limit);

      if (
        Number.isFinite(parsedLimit) &&
        parsedLimit > 0
      ) {
        take = Math.floor(parsedLimit);
      }
    }

    const vitalSigns =
      await prisma.vitalSign.findMany({
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

    return response.json(data);
  }
}