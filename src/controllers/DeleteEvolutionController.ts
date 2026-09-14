import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DeleteEvolutionController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    const { id: evolutionId } = request.params;

    if (!evolutionId || Array.isArray(evolutionId)) {
      return response.status(400).json({
        error: "ID da evolução inválido.",
      });
    }

    try {
      const evolution = await prisma.evolution.findUnique({
        where: {
          id: evolutionId,
        },
        select: {
          id: true,
        },
      });

      if (!evolution) {
        return response.status(404).json({
          error: "Evolução não encontrada.",
        });
      }

      return response.status(409).json({
        error: "Exclusão de evolução não permitida.",
        message:
          "Evoluções clínicas não podem ser excluídas fisicamente. " +
          "Para corrigir uma informação, utilize o procedimento de " +
          "correção ou adendo definido pela instituição.",
      });
    } catch (error) {
      console.error("Erro ao processar exclusão de evolução:", error);

      return response.status(500).json({
        error: "Erro ao processar a exclusão da evolução.",
      });
    }
  }
}