import { Request, Response } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

function isValidDate(value: unknown): boolean {
  const date = new Date(String(value));
  return !Number.isNaN(date.getTime());
}

function normalizeOptionalString(
  value: unknown
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;

  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

export class UpdatePatientController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;
    const userRole = request.user?.cargo as UserRole | undefined;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    if (!userRole) {
      return response.status(403).json({
        error: "Cargo do usuário não identificado.",
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

      const body = request.body ?? {};

      /*
       * ============================================================
       * CAMPOS ADMINISTRATIVOS / CADASTRAIS
       * ============================================================
       */

      const commonAdministrativeFields = [
        "nome",
        "dataNascimento",
        "cpf",
        "rg",
        "naturalidade",
        "estadoCivil",
        "cartaoSus",
        "fotoUrl",
        "quartoLeito",
        "genero",
        "responsavel",
        "telefone",
        "responsavelCpf",
        "responsavelGrauParentesco",
        "responsavelEmail",
        "responsavelEndereco",
        "planoSaude",
        "contatoEmergencia",
        "observacoes",
      ];

      /*
       * ============================================================
       * CAMPOS SOCIAIS / ASSISTENCIAIS
       * ============================================================
       */

      const socialFields = [
        "grauDependencia",
        "restricaoAlimentar",
      ];

      const nursingFields = [
        "tipoSanguineo",
        "grauDependencia",
        "restricaoAlimentar",
        "alergias",
        "observacoes",
      ];

      /*
       * ============================================================
       * STATUS INSTITUCIONAL
       *
       * Internação, alta e óbito não são tratados como simples
       * alterações cadastrais.
       * ============================================================
       */

      const institutionalStatusFields = [
        "dataInternacao",
        "dataAlta",
        "falecido",
      ];

      let allowedFields: string[] = [];

      switch (userRole) {
        case UserRole.COORDENADOR:
          allowedFields = [
            ...commonAdministrativeFields,
            ...socialFields,
            ...nursingFields,
            "historicoMedico",
            "diagnosticos",
            ...institutionalStatusFields,
          ];
          break;

        case UserRole.ASSISTENTE_SOCIAL:
          allowedFields = [
            ...commonAdministrativeFields,
            ...socialFields,
          ];
          break;

        case UserRole.ENFERMEIRO:
          allowedFields = [
            ...commonAdministrativeFields,
            ...nursingFields,
          ];
          break;

        case UserRole.RECEPCAO:
          allowedFields = [
            ...commonAdministrativeFields,
          ];
          break;

        default:
          return response.status(403).json({
            error:
              "Seu cargo não possui permissão para atualizar pacientes.",
          });
      }

      const requestedFields = Object.keys(body);

      const forbiddenFields = requestedFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (forbiddenFields.length > 0) {
        return response.status(403).json({
          error:
            "Você não possui permissão para alterar um ou mais campos.",
          campos: forbiddenFields,
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
        falecido,
      } = body;

      /*
       * ============================================================
       * VALIDAÇÕES BÁSICAS
       * ============================================================
       */

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

      if (
        falecido !== undefined &&
        typeof falecido !== "boolean"
      ) {
        return response.status(400).json({
          error: "O campo falecido deve ser verdadeiro ou falso.",
        });
      }

      /*
       * ============================================================
       * CONVERSÃO DE DATAS
       * ============================================================
       */

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

      /*
       * ============================================================
       * REGRA DE CONSISTÊNCIA DO ÓBITO
       * ============================================================
       *
       * Quando o residente é marcado como falecido, o cadastro
       * permanece preservado. Não apagamos dados do paciente.
       */

      if (
        falecido === true &&
        patientExists.ativo === true
      ) {
        // A situação de óbito não apaga o cadastro.
        // O campo ativo não é alterado automaticamente aqui,
        // pois são conceitos distintos no Prisma.
      }

      /*
       * ============================================================
       * MONTAGEM DO UPDATE
       * ============================================================
       */

      const data: Record<string, unknown> = {};

      if (nome !== undefined) {
        data.nome = nome.trim();
      }

      if (parsedDataNascimento !== undefined) {
        data.dataNascimento = parsedDataNascimento;
      }

      const optionalFields: Array<[string, unknown]> = [
        ["cpf", cpf],
        ["rg", rg],
        ["naturalidade", naturalidade],
        ["estadoCivil", estadoCivil],
        ["cartaoSus", cartaoSus],
        ["fotoUrl", fotoUrl],
        ["quartoLeito", quartoLeito],
        ["genero", genero],
        ["responsavel", responsavel],
        ["telefone", telefone],
        ["responsavelCpf", responsavelCpf],
        ["responsavelGrauParentesco", responsavelGrauParentesco],
        ["responsavelEmail", responsavelEmail],
        ["responsavelEndereco", responsavelEndereco],
        ["tipoSanguineo", tipoSanguineo],
        ["planoSaude", planoSaude],
        ["contatoEmergencia", contatoEmergencia],
        ["grauDependencia", grauDependencia],
        ["historicoMedico", historicoMedico],
        ["alergias", alergias],
        ["diagnosticos", diagnosticos],
        ["restricaoAlimentar", restricaoAlimentar],
        ["observacoes", observacoes],
      ];

      for (const [field, value] of optionalFields) {
        if (value !== undefined) {
          data[field] = normalizeOptionalString(value);
        }
      }

      if (parsedDataInternacao !== undefined) {
        data.dataInternacao = parsedDataInternacao;
      }

      if (parsedDataAlta !== undefined) {
        data.dataAlta = parsedDataAlta;
      }

      if (falecido !== undefined) {
        data.falecido = falecido;
      }

      if (Object.keys(data).length === 0) {
        return response.status(400).json({
          error:
            "Nenhum campo válido foi informado para atualização.",
        });
      }

      /*
       * ============================================================
       * IDENTIFICA CAMPOS REALMENTE ALTERADOS
       * ============================================================
       */

      const changedFields = Object.keys(data).filter((field) => {
        const oldValue =
          patientExists[field as keyof typeof patientExists];

        const newValue = data[field];

        if (oldValue instanceof Date && newValue instanceof Date) {
          return oldValue.getTime() !== newValue.getTime();
        }

        return oldValue !== newValue;
      });

      if (changedFields.length === 0) {
        return response.status(200).json(patientExists);
      }

      /*
       * ============================================================
       * ATUALIZA
       * ============================================================
       */

      const patient = await prisma.patient.update({
        where: {
          id: patientId,
        },
        data,
      });

      /*
       * ============================================================
       * AUDITORIA
       * ============================================================
       */

      await createAuditLog({
        userId,
        acao: AuditActions.UPDATE,
        entidade: "PATIENT",
        entidadeId: patient.id,
        descricao:
          `Paciente "${patient.nome}" atualizado por ${userRole}. ` +
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