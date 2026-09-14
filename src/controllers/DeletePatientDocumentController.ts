import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class DeletePatientDocumentController {
  async handle(request: Request, response: Response) {
    const documentId = String(request.params.id);
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const document = await prisma.patientDocument.findUnique({
        where: { id: documentId },
        include: {
          patient: {
            select: {
              nome: true,
            },
          },
        },
      });

      if (!document) {
        return response.status(404).json({
          error: "Documento não encontrado.",
        });
      }

      if (document.deletedAt) {
        return response.status(409).json({
          error: "Este documento já foi excluído.",
        });
      }

      await prisma.patientDocument.update({
        where: {
          id: documentId,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: userId,
          deletedByUserId: userId,
        },
      });

      await createAuditLog({
        userId,
        acao: AuditActions.DELETE,
        entidade: "PATIENT_DOCUMENT",
        entidadeId: documentId,
        descricao:
          `Documento "${document.nome}" do paciente ` +
          `"${document.patient.nome}" foi marcado como excluído.`,
      });

      return response.status(204).send();
    } catch (error) {
      console.error(
        "Erro ao excluir documento do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao tentar excluir o documento.",
      });
    }
  }
}