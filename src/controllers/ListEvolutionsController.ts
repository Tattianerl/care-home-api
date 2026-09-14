import { Request, Response } from "express";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";

function parseDateStart(value: string): Date | null {
  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDateEndExclusive(value: string): Date | null {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setDate(date.getDate() + 1);

  return date;
}

export class ListEvolutionsController {
  async handle(request: Request, response: Response) {
    try {
      const {
        today,
        patientId,
        professional,
        startDate,
        endDate,
      } = request.query;

      if (
        today !== undefined &&
        String(today).toLowerCase() !== "true" &&
        String(today).toLowerCase() !== "false"
      ) {
        return response.status(400).json({
          error: "O parâmetro 'today' deve ser true ou false.",
        });
      }

      const where: Prisma.EvolutionWhereInput = {};

      if (patientId !== undefined) {
        const patientIdValue = String(patientId).trim();

        if (!patientIdValue) {
          return response.status(400).json({
            error: "ID do paciente inválido.",
          });
        }

        where.patientId = patientIdValue;
      }

      if (professional !== undefined) {
        const profValue = String(professional).trim();

        if (!profValue) {
          return response.status(400).json({
            error: "Profissional inválido.",
          });
        }

        const role = Object.values(UserRole).find(
          (item) =>
            item.toLowerCase() === profValue.toLowerCase()
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

      if (startDate || endDate) {
        if (startDate && typeof startDate !== "string") {
          return response.status(400).json({
            error: "Data inicial inválida.",
          });
        }

        if (endDate && typeof endDate !== "string") {
          return response.status(400).json({
            error: "Data final inválida.",
          });
        }

        const start = startDate
          ? parseDateStart(startDate)
          : null;

        const endExclusive = endDate
          ? parseDateEndExclusive(endDate)
          : null;

        if (startDate && !start) {
          return response.status(400).json({
            error: "Data inicial inválida.",
          });
        }

        if (endDate && !endExclusive) {
          return response.status(400).json({
            error: "Data final inválida.",
          });
        }

        if (start && endExclusive && start >= endExclusive) {
          return response.status(400).json({
            error:
              "A data inicial deve ser anterior ou igual à data final.",
          });
        }

        where.createdAt = {};

        if (start) {
          where.createdAt.gte = start;
        }

        if (endExclusive) {
          where.createdAt.lt = endExclusive;
        }
      } else if (String(today).toLowerCase() === "true") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        where.createdAt = {
          gte: start,
          lt: end,
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

      return response.status(200).json({
        total: evolutions.length,
        evolutions,
      });
    } catch (error) {
      console.error("Erro ao listar evoluções:", error);

      return response.status(500).json({
        error: "Erro ao listar evoluções.",
      });
    }
  }
}