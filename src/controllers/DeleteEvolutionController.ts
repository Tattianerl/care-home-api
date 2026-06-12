import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export class DeleteEvolutionController {
  async handle(request: Request, response: Response) {
    const evolutionId = request.params.id as string;

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

    await prisma.evolution.delete({
      where: {
        id: evolutionId,
      },
    });

    return response.status(200).json({
      message: "Evolução deletada com sucesso",
    });
  }
}