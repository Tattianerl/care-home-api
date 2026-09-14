import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class ResetPasswordByAdminController {
  async handle(request: Request, response: Response) {
    const adminUserId = request.user?.id;

    if (!adminUserId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const { funcionarioId, novaSenhaProvisoria } = request.body;

      if (
        typeof funcionarioId !== "string" ||
        !funcionarioId.trim()
      ) {
        return response.status(400).json({
          error: "O ID do funcionário é obrigatório.",
        });
      }

      if (
        typeof novaSenhaProvisoria !== "string" ||
        !novaSenhaProvisoria
      ) {
        return response.status(400).json({
          error: "A nova senha provisória é obrigatória.",
        });
      }

      if (novaSenhaProvisoria.length < 8) {
        return response.status(400).json({
          error: "A senha provisória deve conter pelo menos 8 caracteres.",
        });
      }

      const funcionarioIdNormalizado = funcionarioId.trim();

      if (funcionarioIdNormalizado === adminUserId) {
        return response.status(400).json({
          error:
            "Para alterar a própria senha, utilize a opção de alteração de senha do seu perfil.",
        });
      }

      const funcionario = await prisma.user.findUnique({
        where: {
          id: funcionarioIdNormalizado,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
          ativo: true,
        },
      });

      if (!funcionario) {
        return response.status(404).json({
          error: "Funcionário não encontrado.",
        });
      }

      const senhaHash = await hash(novaSenhaProvisoria, 10);

      await prisma.user.update({
        where: {
          id: funcionario.id,
        },
        data: {
          senha: senhaHash,
        },
      });

      await createAuditLog({
        userId: adminUserId,
        acao: AuditActions.UPDATE,
        entidade: "USER",
        entidadeId: funcionario.id,
        descricao:
          `Senha do funcionário "${funcionario.nome}" ` +
          `(${funcionario.email}) foi redefinida por um administrador.`,
      });

      return response.status(200).json({
        message: "Senha redefinida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao resetar senha:", error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return response.status(404).json({
          error: "Funcionário não encontrado.",
        });
      }

      return response.status(500).json({
        error: "Erro interno ao redefinir a senha.",
      });
    }
  }
}