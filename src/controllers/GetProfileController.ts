import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export class GetProfileController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          cargo: true,
          registroProfissional: true,
          fotoUrl: true,
          assinatura: true,
          dataAdmissao: true,
          observacoes: true,
          ativo: true,
          ultimoLogin: true,
          createdAt: true,
        },
      });

      if (!user) {
        return response.status(404).json({
          error: "Usuário não encontrado.",
        });
      }

      return response.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);

      return response.status(500).json({
        error: "Erro interno ao buscar perfil.",
      });
    }
  }
}