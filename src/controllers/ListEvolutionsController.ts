import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export class ListEvolutionsController {
  async handle(request: Request, response: Response) {
    const evolutions = await prisma.evolution.findMany({
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

    return response.json(evolutions);
  }
}