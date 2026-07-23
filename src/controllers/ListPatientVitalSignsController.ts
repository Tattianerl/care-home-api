import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientVitalSignsController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;
    const { startDate, endDate, limit } = request.query;

    const whereCondition: any = { patientId };

    // Tratamento e validação de datas para o filtro
    if (startDate && endDate) {
      whereCondition.createdAt = {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate)),
      };
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
      take: limit ? Number(limit) : undefined,
    });

    return response.json(vitalSigns);
  }
}