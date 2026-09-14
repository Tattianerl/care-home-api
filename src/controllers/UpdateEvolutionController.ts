import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class UpdateEvolutionController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;
    const { id: evolutionId } = request.params;
    const { descricao } = request.body;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    if (!evolutionId || Array.isArray(evolutionId)) {
      return response.status(400).json({
        error: "ID da evolução inválido.",
      });
    }

    if (typeof descricao !== "string" || !descricao.trim()) {
      return response.status(400).json({
        error: "A descrição da evolução é obrigatória.",
      });
    }

    try {
      const evolutionExists = await prisma.evolution.findUnique({
        where: {
          id: evolutionId,
        },
        include: {
          patient: {
            select: {
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
      });

      if (!evolutionExists) {
        return response.status(404).json({
          error: "Evolução não encontrada.",
        });
      }

      if (evolutionExists.user.id !== userId) {
        return response.status(403).json({
          error: "Acesso negado.",
          message:
            "Uma evolução clínica só pode ser alterada pelo profissional que a registrou.",
        });
      }

      const descricaoAnterior = evolutionExists.descricao;
      const novaDescricao = descricao.trim();

      if (descricaoAnterior === novaDescricao) {
        return response.status(400).json({
          error: "A nova descrição é igual à descrição atual.",
        });
      }

      const evolution = await prisma.evolution.update({
        where: {
          id: evolutionId,
        },
        data: {
          descricao: novaDescricao,
        },
      });

      await createAuditLog({
        userId,
        acao: AuditActions.UPDATE,
        entidade: "EVOLUTION",
        entidadeId: evolution.id,
        descricao:
          `Evolução do paciente "${evolutionExists.patient.nome}" ` +
          `atualizada pelo profissional "${evolutionExists.user.nome}". ` +
          `Conteúdo anterior: "${descricaoAnterior}"`,
      });

      return response.status(200).json(evolution);
    } catch (error) {
      console.error("Erro ao atualizar evolução:", error);

      return response.status(500).json({
        error: "Erro ao atualizar evolução.",
      });
    }
  }
}