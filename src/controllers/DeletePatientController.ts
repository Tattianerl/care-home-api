import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class DeletePatientController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    const { id: patientId } = request.params;

    if (!patientId || Array.isArray(patientId)) {
      return response.status(400).json({
        error: "ID do paciente inválido.",
      });
    }

    try {
      const patientExists = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
      });

      if (!patientExists) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      if (!patientExists.ativo) {
        return response.status(409).json({
          error: "Paciente já está desativado.",
        });
      }

      await prisma.patient.update({
        where: {
          id: patientId,
        },
        data: {
          ativo: false,
        },
      });

      await createAuditLog({
        userId,
        acao: AuditActions.DEACTIVATE,
        entidade: "PATIENT",
        entidadeId: patientExists.id,
        descricao: `Paciente "${patientExists.nome}" desativado.`,
      });

      return response.status(200).json({
        message: "Paciente desativado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao desativar paciente:", error);

      return response.status(500).json({
        error: "Erro ao desativar paciente.",
      });
    }
  }
}