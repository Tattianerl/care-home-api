import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/createAuditLog";

export class UpdatePatientController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const {
      nome,
      dataNascimento,
      responsavel,
      telefone,
      historicoMedico,
      medicamentos,
      alergias,
      diagnosticos,
      observacoes,
    } = request.body;

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

    const patient = await prisma.patient.update({
      where: {
        id: patientId,
      },
      data: {
        nome,
        dataNascimento: dataNascimento
          ? new Date(dataNascimento)
          : undefined,
        responsavel,
        telefone,
        historicoMedico,
        medicamentos,
        alergias,
        diagnosticos,
        observacoes,
      },
    });
    await createAuditLog({
      userId: request.user!.id,
      acao: "UPDATE",
      entidade: "PATIENT",
      entidadeId: patient.id,
      descricao: `Paciente ${patient.nome} atualizado`,
    });

    return response.json(patient);
  }
}