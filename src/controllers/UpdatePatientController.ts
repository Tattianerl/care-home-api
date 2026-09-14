import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

function isValidDate(value: unknown): value is string | Date {
  const date = new Date(String(value));
  return !Number.isNaN(date.getTime());
}

export class UpdatePatientController {
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

      if (
        nome !== undefined &&
        (typeof nome !== "string" || !nome.trim())
      ) {
        return response.status(400).json({
          error: "Nome do paciente inválido.",
        });
      }

      if (
        dataNascimento !== undefined &&
        !isValidDate(dataNascimento)
      ) {
        return response.status(400).json({
          error: "Data de nascimento inválida.",
        });
      }

      if (
        dataInternacao !== undefined &&
        dataInternacao !== null &&
        !isValidDate(dataInternacao)
      ) {
        return response.status(400).json({
          error: "Data de internação inválida.",
        });
      }

      if (
        dataAlta !== undefined &&
        dataAlta !== null &&
        !isValidDate(dataAlta)
      ) {
        return response.status(400).json({
          error: "Data de alta inválida.",
        });
      }

      const parsedDataNascimento =
        dataNascimento !== undefined
          ? new Date(dataNascimento)
          : undefined;

      const parsedDataInternacao =
        dataInternacao !== undefined && dataInternacao !== null
          ? new Date(dataInternacao)
          : dataInternacao === null
            ? null
            : undefined;

      const parsedDataAlta =
        dataAlta !== undefined && dataAlta !== null
          ? new Date(dataAlta)
          : dataAlta === null
            ? null
            : undefined;

      const finalDataInternacao =
        parsedDataInternacao !== undefined
          ? parsedDataInternacao
          : patientExists.dataInternacao;

      const finalDataAlta =
        parsedDataAlta !== undefined
          ? parsedDataAlta
          : patientExists.dataAlta;

      if (
        finalDataInternacao &&
        finalDataAlta &&
        finalDataAlta < finalDataInternacao
      ) {
        return response.status(400).json({
          error:
            "A data de alta não pode ser anterior à data de internação.",
        });
      }

      const data: Record<string, unknown> = {};

      if (nome !== undefined) data.nome = nome.trim();

      if (parsedDataNascimento !== undefined) {
        data.dataNascimento = parsedDataNascimento;
      }

      if (cpf !== undefined) data.cpf = cpf;
      if (rg !== undefined) data.rg = rg;
      if (naturalidade !== undefined) data.naturalidade = naturalidade;
      if (estadoCivil !== undefined) data.estadoCivil = estadoCivil;
      if (cartaoSus !== undefined) data.cartaoSus = cartaoSus;
      if (fotoUrl !== undefined) data.fotoUrl = fotoUrl;
      if (quartoLeito !== undefined) data.quartoLeito = quartoLeito;
      if (genero !== undefined) data.genero = genero;

      if (responsavel !== undefined) data.responsavel = responsavel;
      if (telefone !== undefined) data.telefone = telefone;
      if (responsavelCpf !== undefined) {
        data.responsavelCpf = responsavelCpf;
      }
      if (responsavelGrauParentesco !== undefined) {
        data.responsavelGrauParentesco = responsavelGrauParentesco;
      }
      if (responsavelEmail !== undefined) {
        data.responsavelEmail = responsavelEmail;
      }
      if (responsavelEndereco !== undefined) {
        data.responsavelEndereco = responsavelEndereco;
      }

      if (tipoSanguineo !== undefined) {
        data.tipoSanguineo = tipoSanguineo;
      }
      if (planoSaude !== undefined) data.planoSaude = planoSaude;
      if (contatoEmergencia !== undefined) {
        data.contatoEmergencia = contatoEmergencia;
      }
      if (grauDependencia !== undefined) {
        data.grauDependencia = grauDependencia;
      }

      if (historicoMedico !== undefined) {
        data.historicoMedico = historicoMedico;
      }
      if (alergias !== undefined) data.alergias = alergias;
      if (diagnosticos !== undefined) data.diagnosticos = diagnosticos;
      if (restricaoAlimentar !== undefined) {
        data.restricaoAlimentar = restricaoAlimentar;
      }
      if (observacoes !== undefined) data.observacoes = observacoes;

      if (parsedDataInternacao !== undefined) {
        data.dataInternacao = parsedDataInternacao;
      }

      if (parsedDataAlta !== undefined) {
        data.dataAlta = parsedDataAlta;
      }

      if (Object.keys(data).length === 0) {
        return response.status(400).json({
          error: "Nenhum campo válido foi informado para atualização.",
        });
      }

      const changedFields = Object.keys(data).filter((field) => {
        const oldValue =
          patientExists[field as keyof typeof patientExists];

        const newValue = data[field];

        if (oldValue instanceof Date && newValue instanceof Date) {
          return oldValue.getTime() !== newValue.getTime();
        }

        return oldValue !== newValue;
      });

      const patient = await prisma.patient.update({
        where: {
          id: patientId,
        },
        data,
      });

      await createAuditLog({
        userId,
        acao: AuditActions.UPDATE,
        entidade: "PATIENT",
        entidadeId: patient.id,
        descricao:
          `Paciente "${patient.nome}" atualizado. ` +
          `Campos alterados: ${changedFields.join(", ")}.`,
      });

      return response.status(200).json(patient);
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);

      return response.status(500).json({
        error: "Erro ao atualizar paciente.",
      });
    }
  }
}