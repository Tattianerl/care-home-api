import { Request, Response } from "express";
import { compare, hash } from "bcryptjs";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class UpdatePasswordController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const { senhaAntiga, novaSenha } = request.body;

      if (
        typeof senhaAntiga !== "string" ||
        !senhaAntiga
      ) {
        return response.status(400).json({
          error: "A senha atual é obrigatória.",
        });
      }

      if (
        typeof novaSenha !== "string" ||
        !novaSenha
      ) {
        return response.status(400).json({
          error: "A nova senha é obrigatória.",
        });
      }

      if (novaSenha.length < 8) {
        return response.status(400).json({
          error: "A nova senha deve ter pelo menos 8 caracteres.",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          senha: true,
        },
      });

      if (!user) {
        return response.status(404).json({
          error: "Usuário não encontrado.",
        });
      }

      const senhaAtualValida = await compare(
        senhaAntiga,
        user.senha
      );

      if (!senhaAtualValida) {
        return response.status(400).json({
          error: "A senha atual está incorreta.",
        });
      }

      const mesmaSenha = await compare(
        novaSenha,
        user.senha
      );

      if (mesmaSenha) {
        return response.status(400).json({
          error: "A nova senha deve ser diferente da senha atual.",
        });
      }

      const novaSenhaCriptografada = await hash(
        novaSenha,
        10
      );

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          senha: novaSenhaCriptografada,
        },
      });

      await createAuditLog({
        userId,
        acao: AuditActions.UPDATE,
        entidade: "USER",
        entidadeId: userId,
        descricao: `Senha do usuário "${user.nome}" foi alterada pelo próprio usuário.`,
      });

      return response.status(200).json({
        message: "Senha atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);

      return response.status(500).json({
        error: "Erro interno ao atualizar senha.",
      });
    }
  }
}