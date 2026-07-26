import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class ListEvolutionsController {
  async handle(request: Request, response: Response) {
   const {
  today,
  patientId,
  professional,
  startDate,
  endDate,
} = request.query;

const where: Prisma.EvolutionWhereInput = {};

if (patientId) {
  where.patientId = String(patientId);
}
if (professional) {

  where.user = {
    nome: {
      contains: String(professional),
      mode: "insensitive",
    },
  };

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

if(startDate || endDate){

  where.createdAt = {};


  if(startDate){

    where.createdAt.gte =
      new Date(
        `${startDate}T00:00:00`
      );

  }


  if(endDate){

    where.createdAt.lte =
      new Date(
        `${endDate}T23:59:59`
      );

  }

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