import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/createAuditLog";

export class CreateEvolutionController {
  async handle(request: Request, response: Response) {
    const {
      descricao,
      patientId,
      assinatura,
    } = request.body;

    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    const evolution = await prisma.evolution.create({
      data: {
        descricao,
        assinatura,
        patientId,
        userId,
      },
    });

    await createAuditLog({
      userId,
      acao: "CREATE",
      entidade: "EVOLUTION",
      entidadeId: evolution.id,
      descricao: `Nova evolução registrada para o paciente ${patient.nome}`,
    });

    return response.status(201).json(evolution);
  }
}