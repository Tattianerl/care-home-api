import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListAuditLogsController {
  async handle(request: Request, response: Response) {

    const page = Number(request.query.page) || 1;

    const limit = Number(request.query.limit) || 10;

    const acao = request.query.acao as string | undefined;

    const entidade = request.query.entidade as string | undefined;

    const userId = request.query.userId as string | undefined;

    const skip = (page - 1) * limit;

    const where = {
      ...(acao && { acao }),
      ...(entidade && { entidade }),
      ...(userId && { userId }),
    };

    const logs = await prisma.auditLog.findMany({
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
    });

    const total = await prisma.auditLog.count({
      where,
    });

    return response.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: logs,
    });
  }
}