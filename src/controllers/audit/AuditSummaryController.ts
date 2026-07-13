import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export class AuditSummaryController {
  async handle(request: Request, response: Response) {
    const year = request.query.year as string | undefined;
    const month = request.query.month as string | undefined;

    const where: any = {};

    if (year || month) {
      const start = new Date(
        Number(year ?? new Date().getFullYear()),
        Number(month ?? "1") - 1,
        1
      );

      const end = new Date(start);

      if (month) {
        end.setMonth(end.getMonth() + 1);
      } else {
        end.setFullYear(end.getFullYear() + 1);
      }

      where.createdAt = {
        gte: start,
        lt: end,
      };
    }

    const logs = await prisma.auditLog.findMany({
      where,
      select: {
        acao: true,
      },
    });

    const summary: Record<string, number> = {
      total: logs.length,
    };

    for (const log of logs) {
      summary[log.acao] = (summary[log.acao] ?? 0) + 1;
    }

    return response.json(summary);
  }
}