import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class TopUsersController {
  async handle(request: Request, response: Response) {
    try {
      const yearParam = request.query.year;
      const monthParam = request.query.month;
      const limitParam = request.query.limit;

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (yearParam !== undefined) {
        const year = Number(yearParam);

        if (
          !Number.isInteger(year) ||
          year < 2000 ||
          year > 2100
        ) {
          return response.status(400).json({
            error: "Ano inválido.",
          });
        }

        if (monthParam !== undefined) {
          const month = Number(monthParam);

          if (
            !Number.isInteger(month) ||
            month < 1 ||
            month > 12
          ) {
            return response.status(400).json({
              error: "Mês inválido. Informe um valor entre 1 e 12.",
            });
          }

          startDate = new Date(
            year,
            month - 1,
            1,
            0,
            0,
            0,
            0
          );

          endDate = new Date(
            year,
            month,
            1,
            0,
            0,
            0,
            0
          );
        } else {
          startDate = new Date(
            year,
            0,
            1,
            0,
            0,
            0,
            0
          );

          endDate = new Date(
            year + 1,
            0,
            1,
            0,
            0,
            0,
            0
          );
        }
      } else if (monthParam !== undefined) {
        return response.status(400).json({
          error: "O ano é obrigatório quando o mês é informado.",
        });
      }

      let limit: number | undefined;

      if (limitParam !== undefined) {
        limit = Number(limitParam);

        if (
          !Number.isInteger(limit) ||
          limit < 1 ||
          limit > 100
        ) {
          return response.status(400).json({
            error: "O limite deve ser um número inteiro entre 1 e 100.",
          });
        }
      }

      const groupedLogs = await prisma.auditLog.groupBy({
        by: ["userId"],
        where: {
          ...(startDate &&
            endDate && {
              createdAt: {
                gte: startDate,
                lt: endDate,
              },
            }),
        },
        _count: {
          userId: true,
        },
        orderBy: {
          _count: {
            userId: "desc",
          },
        },
        ...(limit !== undefined && {
          take: limit,
        }),
      });

      if (groupedLogs.length === 0) {
        return response.status(200).json([]);
      }

      const userIds = groupedLogs.map(
        (item) => item.userId
      );

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          nome: true,
          cargo: true,
        },
      });

      const usersMap = new Map(
        users.map((user) => [user.id, user])
      );

      const ranking = groupedLogs
        .map((item) => {
          const user = usersMap.get(item.userId);

          if (!user) {
            return null;
          }

          return {
            userId: user.id,
            nome: user.nome,
            cargo: user.cargo,
            acoes: item._count.userId,
          };
        })
        .filter((item) => item !== null);

      return response.status(200).json(ranking);
    } catch (error) {
      console.error(
        "Erro ao buscar ranking de usuários:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao buscar ranking de usuários.",
      });
    }
  }
}