import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class CreatePatientMedicationController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;
    const userId = request.user?.id;

    const {
      nome,
      dosagem,
      frequencia,
      viaAdministracao,
      observacoes,
    } = request.body;

    if (!nome || !dosagem || !frequencia) {
      return response.status(400).json({
        error: "Nome, dosagem e frequência são campos obrigatórios.",
      });
    }

    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patientExists) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    const medication = await prisma.medication.create({
      data: {
        nome,
        dosagem,
        frequencia,
        viaAdministracao,
        observacoes,
        patientId,
        userId: userId as string,
      },
    });

    await createAuditLog({
      userId: request.user!.id,
      acao: AuditActions.CREATE,
      entidade: "MEDICATION",
      entidadeId: medication.id,
      descricao: `Medicamento ${medication.nome} cadastrado para o paciente ${patientExists.nome}`,
    });

    return response.status(201).json(medication);
  }
}