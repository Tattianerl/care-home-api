import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/createAuditLog";

export class CreateVitalSignController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const {
      pressao,
      temperatura,
      glicemia,
      frequenciaCardiaca,
      saturacao,
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
        pressao,
        temperatura,
        glicemia,
        frequenciaCardiaca,
        saturacao,
        observacoes,
        patientId,
        userId: userId as string,
      },
    });

    await createAuditLog({
      userId: request.user!.id,
      acao: "CREATE",
      entidade: "VITAL_SIGN",
      entidadeId: vitalSign.id,
      descricao: `Sinais vitais registrados para o paciente ${patientExists.nome}`,
    });

    return response.status(201).json(vitalSign);
  }
}