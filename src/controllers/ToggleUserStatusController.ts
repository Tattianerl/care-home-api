import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class ToggleUserStatusController {
  async handle(request: Request, response: Response) {
    const adminId = request.user?.id;

    if (!adminId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const id = String(request.params.id ?? "").trim();

      if (!id) {
        return response.status(400).json({
          error: "ID do funcionário é obrigatório.",
        });
      }

      if (id === adminId) {
        return response.status(400).json({
          error: "Você não pode desativar a própria conta.",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
          ativo: true,
        },
      });

      if (!user) {
        return response.status(404).json({
          error: "Funcionário não encontrado.",
        });
      }

      const novoStatus = !user.ativo;

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          ativo: novoStatus,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
          ativo: true,
        },
      });

      await createAuditLog({
        userId: adminId,
        acao: AuditActions.UPDATE,
        entidade: "USER",
        entidadeId: user.id,
        descricao:
          `Status do funcionário "${user.nome}" ` +
          `alterado de "${user.ativo ? "ATIVO" : "INATIVO"}" ` +
          `para "${novoStatus ? "ATIVO" : "INATIVO"}".`,
      });

      return response.status(200).json({
        message: novoStatus
          ? `Funcionário ${user.nome} reativado com sucesso.`
          : `Funcionário ${user.nome} desativado com sucesso.`,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return response.status(404).json({
          error: "Funcionário não encontrado.",
        });
      }

      return response.status(500).json({
        error: "Erro interno ao alterar o status do funcionário.",
      });
    }
  }
}