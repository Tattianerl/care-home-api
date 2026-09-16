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

function isSingleQueryValue(
  value: unknown
): value is string {
  return typeof value === "string";
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

      /*
       * ============================================================
       * VALIDAÇÃO DOS PARÂMETROS
       * ============================================================
       */

      if (
        today !== undefined &&
        !isSingleQueryValue(today)
      ) {
        return response.status(400).json({
          error: "O parâmetro 'today' é inválido.",
        });
      }

      if (
        today !== undefined &&
        today.toLowerCase() !== "true" &&
        today.toLowerCase() !== "false"
      ) {
        return response.status(400).json({
          error: "O parâmetro 'today' deve ser true ou false.",
        });
      }

      if (
        patientId !== undefined &&
        !isSingleQueryValue(patientId)
      ) {
        return response.status(400).json({
          error: "O parâmetro 'patientId' é inválido.",
        });
      }

      if (
        professional !== undefined &&
        !isSingleQueryValue(professional)
      ) {
        return response.status(400).json({
          error: "O parâmetro 'professional' é inválido.",
        });
      }

      if (
        startDate !== undefined &&
        !isSingleQueryValue(startDate)
      ) {
        return response.status(400).json({
          error: "Data inicial inválida.",
        });
      }

      if (
        endDate !== undefined &&
        !isSingleQueryValue(endDate)
      ) {
        return response.status(400).json({
          error: "Data final inválida.",
        });
      }

      const where: Prisma.EvolutionWhereInput = {};

      /*
       * ============================================================
       * FILTRO POR PACIENTE
       * ============================================================
       */

      if (patientId !== undefined) {
        const patientIdValue = patientId.trim();

        if (!patientIdValue) {
          return response.status(400).json({
            error: "ID do paciente inválido.",
          });
        }

        where.patientId = patientIdValue;
      }

      /*
       * ============================================================
       * FILTRO POR PROFISSIONAL
       * ============================================================
       */

      if (professional !== undefined) {
        const professionalValue = professional.trim();

        if (!professionalValue) {
          return response.status(400).json({
            error: "Profissional inválido.",
          });
        }

        const role = Object.values(UserRole).find(
          (item) =>
            item.toLowerCase() ===
            professionalValue.toLowerCase()
        );

        const filters: Prisma.UserWhereInput[] = [
          {
            id: professionalValue,
          },
          {
            nome: {
              contains: professionalValue,
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

      /*
       * ============================================================
       * FILTRO POR PERÍODO
       * ============================================================
       */

      if (startDate !== undefined || endDate !== undefined) {
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

        if (
          start &&
          endExclusive &&
          start >= endExclusive
        ) {
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
      } else if (
        today !== undefined &&
        today.toLowerCase() === "true"
      ) {
        const start = new Date();

        start.setHours(0, 0, 0, 0);

        const end = new Date(start);

        end.setDate(end.getDate() + 1);

        where.createdAt = {
          gte: start,
          lt: end,
        };
      }

      /*
       * ============================================================
       * CONSULTA
       * ============================================================
       */

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
              cargo: true,
              registroProfissional: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      /*
       * ============================================================
       * RESPOSTA
       * ============================================================
       */

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