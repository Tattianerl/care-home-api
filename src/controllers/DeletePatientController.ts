import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/createAuditLog";

export class DeletePatientController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const patientExists = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patientExists) {
      return response.status(404).json({
        error: "Paciente não encontrado",
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
      userId: request.user!.id,
      acao: "DEACTIVATE",
      entidade: "PATIENT",
      entidadeId: patientExists.id,
      descricao: `Paciente ${patientExists.nome} desativado`,
    });

    return response.status(200).json({
      message: "Paciente desativado com sucesso",
    });
  }
}