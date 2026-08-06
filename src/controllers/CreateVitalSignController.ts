import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class CreateVitalSignController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const {
      pressaoSistolica,
      pressaoDiastolica,
      temperatura,
      frequenciaCardiaca,
      frequenciaRespiratoria,
      saturacao,
      glicemia,
      peso,
      altura,
      imc,
      dor,
      observacoes,
    } = request.body;

    const userId = request.user?.id;

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

    const vitalSign = await prisma.vitalSign.create({
      data: {
        pressaoSistolica,
        pressaoDiastolica,
        temperatura,
        frequenciaCardiaca,
        frequenciaRespiratoria,
        saturacao,
        glicemia,
        peso,
        altura,
        imc,
        dor,
        observacoes,
        patientId,
        userId: userId as string,
      },
    });

    await createAuditLog({
      userId: userId as string,
      acao: AuditActions.CREATE,
      entidade: "VITAL_SIGN",
      entidadeId: vitalSign.id,
      descricao: `Sinais vitais registrados para o paciente ${patientExists.nome}`,
    });

    return response.status(201).json(vitalSign);
  }
}