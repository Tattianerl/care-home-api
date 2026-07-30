import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class CreatePatientController {
  async handle(request: Request, response: Response) {
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

    const patient = await prisma.patient.create({
      data: {
        nome,
        dataNascimento: new Date(dataNascimento),

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
      acao: AuditActions.CREATE,
      entidade: "PATIENT",
      entidadeId: patient.id,
      descricao: `Paciente ${patient.nome} cadastrado`,
    });

    return response.status(201).json(patient);
  }
}