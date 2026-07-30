import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class UpdatePatientController {
  async handle(request: Request, response: Response) {
    const { id: patientId } = request.params as { id: string };
    const {
      nome,
      dataNascimento,

      cpf,
      rg,
      cartaoSus,
      fotoUrl,
      quartoLeito,
      genero,

      responsavel,
      telefone,
      responsavelCpf,
      responsavelGrauParentesco,
      responsavelEmail,
      responsavelEndereco,

      tipoSanguineo,
      planoSaude,
      contatoEmergencia,
      grauDependencia,

      historicoMedico,
      medicamentos,
      alergias,
      diagnosticos,
      restricaoAlimentar,
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

        cpf,
        rg,
        cartaoSus,
        fotoUrl,
        quartoLeito,
        genero,

        responsavel,
        telefone,
        responsavelCpf,
        responsavelGrauParentesco,
        responsavelEmail,
        responsavelEndereco,

        tipoSanguineo,
        planoSaude,
        contatoEmergencia,
        grauDependencia,

        historicoMedico,
        medicamentos,
        alergias,
        diagnosticos,
        restricaoAlimentar,
        observacoes,
      },
    });

    await createAuditLog({
      userId: request.user!.id,
      acao: AuditActions.UPDATE,
      entidade: "PATIENT",
      entidadeId: patient.id,
      descricao: `Paciente ${patient.nome} atualizado`,
    });

    return response.json(patient);
  }
}