import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class UpdateEvolutionController {
  async handle(request: Request, response: Response) {
    const evolutionId = request.params.id as string;
    const { descricao } = request.body;

    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

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
      },
    });

    await createAuditLog({
      userId,
      acao: AuditActions.UPDATE,
      entidade: "EVOLUTION",
      entidadeId: evolution.id,
      descricao: `Evolução do paciente ${evolutionExists.patient.nome} atualizada`,
    });

    return response.json(evolution);
  }
}