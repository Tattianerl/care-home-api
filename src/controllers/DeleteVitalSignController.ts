import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class DeleteVitalSignController {
  async handle(
    request: Request<{ id: string }>,
    response: Response
  ) {
    const vitalSignId = request.params.id;

    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const existing =
      await prisma.vitalSign.findUnique({
        where: {
          id: vitalSignId,
        },

        include: {
          patient: {
            select: {
              nome: true,
            },
          },
        },
      });

    if (!existing) {
      return response.status(404).json({
        error: "Sinal vital não encontrado",
      });
    }

    await prisma.vitalSign.delete({
      where: {
        id: vitalSignId,
      },
    });

    await createAuditLog({
      userId,

      acao: AuditActions.DELETE,

      entidade: "VITAL_SIGN",

      entidadeId: vitalSignId,

      descricao:
        `Sinal vital excluído do paciente ${existing.patient.nome}`,
    });

    return response.status(204).send();
  }
}