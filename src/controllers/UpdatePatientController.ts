import { Request, Response } from "express";
import { Prisma, UserRole } from "@prisma/client";

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
       * CAMPOS PERMITIDOS POR CARGO
       * ============================================================
       *
       * Princípio do menor privilégio:
       * cada cargo pode alterar somente os campos necessários
       * para sua função.
       */

      const receptionFields = [
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

      const socialAssistantFields = [
        ...receptionFields,
        "grauDependencia",
        "restricaoAlimentar",
      ];

      const nurseFields = [
        ...receptionFields,
        "tipoSanguineo",
        "grauDependencia",
        "restricaoAlimentar",
        "alergias",
      ];

      const doctorFields = [
        "tipoSanguineo",
        "historicoMedico",
        "alergias",
        "diagnosticos",
        "observacoes",
      ];

      let allowedFields: string[];

      switch (userRole) {
        case UserRole.RECEPCAO:
          allowedFields = receptionFields;
          break;

        case UserRole.ASSISTENTE_SOCIAL:
          allowedFields = socialAssistantFields;
          break;

        case UserRole.ENFERMEIRO:
          allowedFields = nurseFields;
          break;

        case UserRole.MEDICO:
          allowedFields = doctorFields;
          break;

        default:
          return response.status(403).json({
            error:
              "Seu cargo não possui permissão para atualizar pacientes.",
          });
      }

      /*
       * ============================================================
       * VALIDAÇÃO DOS CAMPOS SOLICITADOS
       * ============================================================
       */

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
      } = body;

      /*
       * ============================================================
       * VALIDAÇÕES
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

      /*
       * ============================================================
       * CONVERSÃO DE DATA
       * ============================================================
       */

      const parsedDataNascimento =
        dataNascimento !== undefined
          ? new Date(dataNascimento)
          : undefined;

      /*
       * ============================================================
       * MONTAGEM DO UPDATE
       * ============================================================
       */

      const data: Prisma.PatientUpdateInput = {};

      if (nome !== undefined) {
        data.nome = nome.trim();
      }

      if (parsedDataNascimento !== undefined) {
        data.dataNascimento = parsedDataNascimento;
      }

      /*
       * Strings opcionais
       */

      const optionalStringFields: Array<[string, unknown]> = [
        ["cpf", cpf],
        ["rg", rg],
        ["naturalidade", naturalidade],
        ["cartaoSus", cartaoSus],
        ["fotoUrl", fotoUrl],
        ["quartoLeito", quartoLeito],
        ["responsavel", responsavel],
        ["telefone", telefone],
        ["responsavelCpf", responsavelCpf],
        ["responsavelGrauParentesco", responsavelGrauParentesco],
        ["responsavelEmail", responsavelEmail],
        ["responsavelEndereco", responsavelEndereco],
        ["planoSaude", planoSaude],
        ["contatoEmergencia", contatoEmergencia],
        ["historicoMedico", historicoMedico],
        ["alergias", alergias],
        ["diagnosticos", diagnosticos],
        ["observacoes", observacoes],
      ];

      for (const [field, value] of optionalStringFields) {
        if (value !== undefined) {
          data[field as keyof Prisma.PatientUpdateInput] =
            normalizeOptionalString(value) as never;
        }
      }

      /*
       * Enums
       */

      if (estadoCivil !== undefined) {
        data.estadoCivil = estadoCivil;
      }

      if (genero !== undefined) {
        data.genero = genero;
      }

      if (tipoSanguineo !== undefined) {
        data.tipoSanguineo = tipoSanguineo;
      }

      if (grauDependencia !== undefined) {
        data.grauDependencia = grauDependencia;
      }

      if (restricaoAlimentar !== undefined) {
        data.restricaoAlimentar =
          normalizeOptionalString(restricaoAlimentar);
      }

      /*
       * ============================================================
       * NENHUM CAMPO
       * ============================================================
       */

      if (Object.keys(data).length === 0) {
        return response.status(400).json({
          error:
            "Nenhum campo válido foi informado para atualização.",
        });
      }

      /*
       * ============================================================
       * IDENTIFICA ALTERAÇÕES
       * ============================================================
       */

      const changedFields = Object.keys(data).filter((field) => {
        const oldValue =
          patientExists[field as keyof typeof patientExists];

        const newValue =
          data[field as keyof Prisma.PatientUpdateInput];

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

