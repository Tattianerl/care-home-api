import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export class DeleteVitalSignController {
  async handle(
    request: Request<{ id: string }>,
    response: Response
  ) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const vitalSignId = String(
        request.params.id ?? ""
      ).trim();

      if (!vitalSignId) {
        return response.status(400).json({
          error: "ID do sinal vital é obrigatório.",
        });
      }

      const existing = await prisma.vitalSign.findUnique({
        where: {
          id: vitalSignId,
        },
        select: {
          id: true,
        },
      });

      if (!existing) {
        return response.status(404).json({
          error: "Sinal vital não encontrado.",
        });
      }

      return response.status(409).json({
        error:
          "Sinais vitais não podem ser excluídos fisicamente. " +
          "O histórico clínico deve ser preservado.",
      });
    } catch (error) {
      console.error(
        "Erro ao excluir sinal vital:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao excluir sinal vital.",
      });
    }
  }
}