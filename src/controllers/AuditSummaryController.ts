import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class AuditSummaryController {
  async handle(request: Request, response: Response) {

    const year = request.query.year as string | undefined;
    const month = request.query.month as string | undefined;

    const logs = await prisma.auditLog.findMany({
      select: {
        acao: true,
        createdAt: true,
      },
    });

    const summary = {
      CREATE: 0,
      UPDATE: 0,
      DEACTIVATE: 0,
      DELETE: 0,
      total: 0,
    };

    logs.forEach((log) => {

      const date = new Date(log.createdAt);

      const logYear = String(date.getFullYear());

      const logMonth = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      if (year && logYear !== year) {
        return;
      }

      if (month && logMonth !== month) {
        return;
      }

      summary.total++;

      if (log.acao === "CREATE") {
        summary.CREATE++;
      }

      if (log.acao === "UPDATE") {
        summary.UPDATE++;
      }

      if (log.acao === "DEACTIVATE") {
        summary.DEACTIVATE++;
      }

      if (log.acao === "DELETE") {
        summary.DELETE++;
      }

    });

    return response.json(summary);
  }
}