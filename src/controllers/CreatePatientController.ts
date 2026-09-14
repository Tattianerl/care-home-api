import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class CreatePatientController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
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

      if (!nome || typeof nome !== "string" || !nome.trim()) {
        return response.status(400).json({
          error: "Nome do paciente é obrigatório.",
        });
      }

      if (!dataNascimento) {
        return response.status(400).json({
          error: "Data de nascimento é obrigatória.",
        });
      }

      const parsedDataNascimento = new Date(dataNascimento);

      if (Number.isNaN(parsedDataNascimento.getTime())) {
        return response.status(400).json({
          error: "Data de nascimento inválida.",
        });
      }

      let parsedDataInternacao: Date | undefined;
      let parsedDataAlta: Date | undefined;

      if (dataInternacao) {
        parsedDataInternacao = new Date(dataInternacao);

        if (Number.isNaN(parsedDataInternacao.getTime())) {
          return response.status(400).json({
            error: "Data de internação inválida.",
          });
        }
      }

      if (dataAlta) {
        parsedDataAlta = new Date(dataAlta);

        if (Number.isNaN(parsedDataAlta.getTime())) {
          return response.status(400).json({
            error: "Data de alta inválida.",
          });
        }
      }

      if (
        parsedDataInternacao &&
        parsedDataAlta &&
        parsedDataAlta < parsedDataInternacao
      ) {
        return response.status(400).json({
          error: "A data de alta não pode ser anterior à data de internação.",
        });
      }

      const patient = await prisma.patient.create({
        data: {
          nome: nome.trim(),
          dataNascimento: parsedDataNascimento,

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

          dataInternacao: parsedDataInternacao,
          dataAlta: parsedDataAlta,
        },
      });

      await createAuditLog({
        userId,
        acao: AuditActions.CREATE,
        entidade: "PATIENT",
        entidadeId: patient.id,
        descricao: `Paciente "${patient.nome}" cadastrado.`,
      });

      return response.status(201).json(patient);
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);

      return response.status(500).json({
        error: "Erro ao cadastrar paciente.",
      });
    }
  }
}