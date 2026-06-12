import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export class ListPatientEvolutionsController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const evolutions = await prisma.evolution.findMany({
      where: {
        patientId,
      },
      include: {
        user: {
          select: {
            nome: true,
            cargo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(evolutions);
  }
}