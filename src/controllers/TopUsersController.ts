import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class TopUsersController {
  async handle(request: Request, response: Response) {

    const year = request.query.year as string | undefined;
    const month = request.query.month as string | undefined;

    const limit = Number(request.query.limit) || undefined;

    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            nome: true,
            cargo: true,
          },
        },
      },
    });

    const usersMap: Record<
      string,
      {
        userId: string;
        nome: string;
        cargo: string;
        acoes: number;
      }
    > = {};

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

      if (!usersMap[log.userId]) {
        usersMap[log.userId] = {
          userId: log.userId,
          nome: log.user.nome,
          cargo: log.user.cargo,
          acoes: 0,
        };
      }

      usersMap[log.userId].acoes++;
    });

    let ranking = Object.values(usersMap)
      .sort((a, b) => b.acoes - a.acoes);

    if (limit) {
      ranking = ranking.slice(0, limit);
    }

    return response.status(200).json(ranking);
  }
}