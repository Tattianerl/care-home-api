import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class ListEvolutionsController {
  async handle(request: Request, response: Response) {
    const { today, patientId } = request.query;

const where: Prisma.EvolutionWhereInput = {};

if (patientId) {
  where.patientId = String(patientId);
}

if (today === "true") {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  where.createdAt = {
    gte: start,
    lte: end,
  };
}

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
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

return response.json({
  total: evolutions.length,
  evolutions,
});
  }
}