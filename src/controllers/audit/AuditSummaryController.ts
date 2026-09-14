import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export class AuditSummaryController {
  async handle(request: Request, response: Response) {
    try {
      const yearParam = request.query.year;
      const monthParam = request.query.month;

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

      const where =
        startDate && endDate
          ? {
              createdAt: {
                gte: startDate,
                lt: endDate,
              },
            }
          : undefined;

      const [total, groupedLogs] = await Promise.all([
        prisma.auditLog.count({
          where,
        }),

        prisma.auditLog.groupBy({
          by: ["acao"],
          where,
          _count: {
            acao: true,
          },
          orderBy: {
            _count: {
              acao: "desc",
            },
          },
        }),
      ]);

      const summary: Record<string, number> = {
        total,
      };

      for (const log of groupedLogs) {
        summary[log.acao] = log._count.acao;
      }

      return response.status(200).json(summary);
    } catch (error) {
      console.error(
        "Erro ao gerar resumo da auditoria:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao gerar resumo da auditoria.",
      });
    }
  }
}