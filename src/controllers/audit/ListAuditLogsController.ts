import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export class ListAuditLogsController {
  async handle(request: Request, response: Response) {
    try {
      const pageParam = request.query.page;
      const limitParam = request.query.limit;

      const page =
        pageParam !== undefined
          ? Number(pageParam)
          : 1;

      const limit =
        limitParam !== undefined
          ? Number(limitParam)
          : 10;

      if (
        !Number.isInteger(page) ||
        page < 1
      ) {
        return response.status(400).json({
          error: "Página inválida.",
        });
      }

      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
      ) {
        return response.status(400).json({
          error: "O limite deve ser um número inteiro entre 1 e 100.",
        });
      }

      const acao =
        typeof request.query.acao === "string"
          ? request.query.acao.trim()
          : undefined;

      const entidade =
        typeof request.query.entidade === "string"
          ? request.query.entidade.trim()
          : undefined;

      const userId =
        typeof request.query.userId === "string"
          ? request.query.userId.trim()
          : undefined;

      const usuario =
        typeof request.query.usuario === "string"
          ? request.query.usuario.trim()
          : undefined;

      const startDateParam =
        typeof request.query.startDate === "string"
          ? request.query.startDate.trim()
          : undefined;

      const endDateParam =
        typeof request.query.endDate === "string"
          ? request.query.endDate.trim()
          : undefined;

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (startDateParam) {
        const parsedStartDate = new Date(startDateParam);

        if (Number.isNaN(parsedStartDate.getTime())) {
          return response.status(400).json({
            error: "Data inicial inválida.",
          });
        }

        startDate = parsedStartDate;
      }

      if (endDateParam) {
        const parsedEndDate = new Date(endDateParam);

        if (Number.isNaN(parsedEndDate.getTime())) {
          return response.status(400).json({
            error: "Data final inválida.",
          });
        }

        endDate = parsedEndDate;
      }

      if (
        startDate &&
        endDate &&
        startDate > endDate
      ) {
        return response.status(400).json({
          error: "A data inicial não pode ser posterior à data final.",
        });
      }

      const skip = (page - 1) * limit;

      const where = {
        ...(acao && {
          acao: {
            contains: acao,
            mode: "insensitive" as const,
          },
        }),

        ...(entidade && {
          entidade: {
            contains: entidade,
            mode: "insensitive" as const,
          },
        }),

        ...(userId && {
          userId,
        }),

        ...(usuario && {
          user: {
            nome: {
              contains: usuario,
              mode: "insensitive" as const,
            },
          },
        }),

        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate && {
                  gte: startDate,
                }),
                ...(endDate && {
                  lte: endDate,
                }),
              },
            }
          : {}),
      };

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
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
        }),

        prisma.auditLog.count({
          where,
        }),
      ]);

      return response.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: logs,
      });
    } catch (error) {
      console.error(
        "Erro ao listar registros de auditoria:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao listar registros de auditoria.",
      });
    }
  }
}