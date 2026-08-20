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
      naturalidade,
      estadoCivil,
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
      alergias,
      diagnosticos,
      restricaoAlimentar,
      observacoes,

      dataInternacao,
      dataAlta,
    } = request.body;

    const patient = await prisma.patient.create({
      data: {
        nome,
        dataNascimento: new Date(dataNascimento),

        cpf,
        rg,
        naturalidade,
        estadoCivil,
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
        alergias,
        diagnosticos,
        restricaoAlimentar,
        observacoes,

        dataInternacao: dataInternacao ? new Date(dataInternacao) : undefined,
        dataAlta: dataAlta ? new Date(dataAlta) : undefined,
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