import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export class ListAuditLogsController {
  async handle(request: Request, response: Response) {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.max(Number(request.query.limit) || 10, 1);

    const acao = request.query.acao as string | undefined;
    const entidade = request.query.entidade as string | undefined;
    const userId = request.query.userId as string | undefined;
    const usuario = request.query.usuario as string | undefined;

    const startDate = request.query.startDate as string | undefined;
    const endDate = request.query.endDate as string | undefined;

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

      ...(userId && { userId }),

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
                gte: new Date(startDate),
              }),
              ...(endDate && {
                lte: new Date(endDate),
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
  }
}