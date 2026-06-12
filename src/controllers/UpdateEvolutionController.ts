import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export class UpdateEvolutionController {
  async handle(request: Request, response: Response) {
    const evolutionId = request.params.id as string;

    const {
      descricao,
      assinatura,
    } = request.body;

    const evolutionExists = await prisma.evolution.findUnique({
      where: {
        id: evolutionId,
      },
    });

    if (!evolutionExists) {
      return response.status(404).json({
        error: "Evolução não encontrada",
      });
    }

    const evolution = await prisma.evolution.update({
      where: {
        id: evolutionId,
      },
      data: {
        descricao,
        assinatura,
      },
    });

    return response.json(evolution);
  }
}
