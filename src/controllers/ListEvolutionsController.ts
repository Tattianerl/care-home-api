import { Request, Response } from "express";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class ListEvolutionsController {
  async handle(request: Request, response: Response) {
    const {
      today,
      patientId,
      professional,
      startDate,
      endDate,
    } = request.query;

    const where: Prisma.EvolutionWhereInput = {};

    // Paciente
    if (patientId) {
      where.patientId = String(patientId);
    }

    // Profissional (ID, Nome ou Cargo)
    if (professional) {
      const profValue = String(professional).trim();

      const role = Object.values(UserRole).find(
        (item) => item.toLowerCase() === profValue.toLowerCase()
      );

      const filters: Prisma.UserWhereInput[] = [
        {
          id: profValue,
        },
        {
          nome: {
            contains: profValue,
            mode: "insensitive",
          },
        },
      ];

      if (role) {
        filters.push({
          cargo: role,
        });
      }

      where.user = {
        is: {
          OR: filters,
        },
      };
    }

    // Período
    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = new Date(`${startDate}T00:00:00`);
      }

      if (endDate) {
        where.createdAt.lte = new Date(`${endDate}T23:59:59`);
      }
    } else if (today === "true") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      where.createdAt = {
        gte: start,
        lte: end,
      };
    }

    const evolutions = await prisma.evolution.findMany({
      where,
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
            email: true,
            cargo: true,
            assinatura: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json({
      total: evolutions.length,
      evolutions,
    });
  }
}