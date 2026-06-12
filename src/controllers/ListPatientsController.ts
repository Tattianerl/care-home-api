import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientsController {
  async handle(request: Request, response: Response) {

    const page = Number(request.query.page) || 1;

    const limit = Number(request.query.limit) || 10;

    const search = String(request.query.search || "");

    const ativoQuery = request.query.ativo as string | undefined;

    const skip = (page - 1) * limit;

    const where = {
      ...(ativoQuery !== undefined && {
        ativo: ativoQuery === "true",
      }),

      nome: {
        contains: search,
        mode: "insensitive" as const,
      },
    };

    const patients = await prisma.patient.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.patient.count({
      where,
    });

    return response.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: patients,
    });
  }
}