import { Request, Response } from "express";
import {
  UserRole,
  MaritalStatus,
  Gender,
  BloodType,
  DependencyLevel,
} from "@prisma/client";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

function parseOptionalString(
  value: unknown
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}

function parseOptionalEnum<T extends string>(
  value: unknown,
  enumObject: Record<string, T>
): T | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim();

  if (
    Object.values(enumObject).includes(
      normalizedValue as T
    )
  ) {
    return normalizedValue as T;
  }

  return undefined;
}

function isValidDate(value: unknown): boolean {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

export class CreatePatientController {
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

    try {
      /*
       * ============================================================
       * PERMISSÕES DE CAMPOS POR CARGO
       * ============================================================
       */

      const administrativeFields = [
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

      const socialFields = [
        "grauDependencia",
        "restricaoAlimentar",
      ];

      const nursingFields = [
        "tipoSanguineo",
        "grauDependencia",
        "restricaoAlimentar",
        "alergias",
      ];

      const coordinatorClinicalFields = [
        "historicoMedico",
        "diagnosticos",
      ];

      const coordinatorStatusFields = [
        "dataInternacao",
        "dataAlta",
      ];

      let allowedFields: string[] = [];

      switch (userRole) {
        case UserRole.COORDENADOR:
          allowedFields = [
            ...administrativeFields,
            ...socialFields,
            ...nursingFields,
            ...coordinatorClinicalFields,
            ...coordinatorStatusFields,
          ];
          break;

        case UserRole.ASSISTENTE_SOCIAL:
          allowedFields = [
            ...administrativeFields,
            ...socialFields,
          ];
          break;

        case UserRole.RECEPCAO:
          allowedFields = [
            ...administrativeFields,
          ];
          break;

        default:
          return response.status(403).json({
            error:
              "Seu cargo não possui permissão para cadastrar pacientes.",
          });
      }

      /*
       * ============================================================
       * BLOQUEIA CAMPOS NÃO PERMITIDOS
       * ============================================================
       */

      const body = request.body ?? {};
      const requestedFields = Object.keys(body);

      const forbiddenFields = requestedFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (forbiddenFields.length > 0) {
        return response.status(403).json({
          error:
            "Você não possui permissão para informar um ou mais campos.",
          campos: forbiddenFields,
        });
      }

      /*
       * ============================================================
       * CAMPOS RECEBIDOS
       * ============================================================
       */

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
      } = body;

      /*
       * ============================================================
       * CAMPOS OBRIGATÓRIOS DO PRISMA
       * ============================================================
       */

      const nomeNormalizado =
        typeof nome === "string" ? nome.trim() : "";

      const responsavelNormalizado =
        typeof responsavel === "string"
          ? responsavel.trim()
          : "";

      const telefoneNormalizado =
        typeof telefone === "string"
          ? telefone.trim()
          : "";

      if (!nomeNormalizado) {
        return response.status(400).json({
          error: "Nome do paciente é obrigatório.",
        });
      }

      if (!dataNascimento) {
        return response.status(400).json({
          error: "Data de nascimento é obrigatória.",
        });
      }

      if (!isValidDate(dataNascimento)) {
        return response.status(400).json({
          error: "Data de nascimento inválida.",
        });
      }

      if (!responsavelNormalizado) {
        return response.status(400).json({
          error: "Responsável é obrigatório.",
        });
      }

      if (!telefoneNormalizado) {
        return response.status(400).json({
          error: "Telefone do responsável é obrigatório.",
        });
      }

      /*
       * ============================================================
       * DATAS
       * ============================================================
       */

      const parsedDataNascimento = new Date(dataNascimento);

      let parsedDataInternacao: Date | undefined;
      let parsedDataAlta: Date | undefined;

      if (
        dataInternacao !== undefined &&
        dataInternacao !== null &&
        dataInternacao !== ""
      ) {
        if (!isValidDate(dataInternacao)) {
          return response.status(400).json({
            error: "Data de internação inválida.",
          });
        }

        parsedDataInternacao = new Date(dataInternacao);
      }

      if (
        dataAlta !== undefined &&
        dataAlta !== null &&
        dataAlta !== ""
      ) {
        if (!isValidDate(dataAlta)) {
          return response.status(400).json({
            error: "Data de alta inválida.",
          });
        }

        parsedDataAlta = new Date(dataAlta);
      }

      if (
        parsedDataInternacao &&
        parsedDataAlta &&
        parsedDataAlta < parsedDataInternacao
      ) {
        return response.status(400).json({
          error:
            "A data de alta não pode ser anterior à data de internação.",
        });
      }

      /*
       * ============================================================
       * ENUMS DO PRISMA
       * ============================================================
       */

      const parsedEstadoCivil = parseOptionalEnum(
        estadoCivil,
        MaritalStatus
      );

      const parsedGenero = parseOptionalEnum(
        genero,
        Gender
      );

      const parsedTipoSanguineo = parseOptionalEnum(
        tipoSanguineo,
        BloodType
      );

      const parsedGrauDependencia = parseOptionalEnum(
        grauDependencia,
        DependencyLevel
      );

      /*
       * Se um enum foi informado com valor inválido,
       * recusamos a requisição em vez de deixar o banco
       * retornar um erro genérico.
       */

      if (
        estadoCivil !== undefined &&
        estadoCivil !== null &&
        estadoCivil !== "" &&
        parsedEstadoCivil === undefined
      ) {
        return response.status(400).json({
          error: "Estado civil inválido.",
        });
      }

      if (
        genero !== undefined &&
        genero !== null &&
        genero !== "" &&
        parsedGenero === undefined
      ) {
        return response.status(400).json({
          error: "Gênero inválido.",
        });
      }

      if (
        tipoSanguineo !== undefined &&
        tipoSanguineo !== null &&
        tipoSanguineo !== "" &&
        parsedTipoSanguineo === undefined
      ) {
        return response.status(400).json({
          error: "Tipo sanguíneo inválido.",
        });
      }

      if (
        grauDependencia !== undefined &&
        grauDependencia !== null &&
        grauDependencia !== "" &&
        parsedGrauDependencia === undefined
      ) {
        return response.status(400).json({
          error: "Grau de dependência inválido.",
        });
      }

      /*
       * ============================================================
       * CAMPOS OPCIONAIS
       * ============================================================
       */

      const parsedCpf = parseOptionalString(cpf);
      const parsedRg = parseOptionalString(rg);
      const parsedNaturalidade = parseOptionalString(naturalidade);
      const parsedCartaoSus = parseOptionalString(cartaoSus);
      const parsedFotoUrl = parseOptionalString(fotoUrl);
      const parsedQuartoLeito = parseOptionalString(quartoLeito);

      const parsedResponsavelCpf =
        parseOptionalString(responsavelCpf);

      const parsedResponsavelGrauParentesco =
        parseOptionalString(responsavelGrauParentesco);

      const parsedResponsavelEmail =
        parseOptionalString(responsavelEmail);

      const parsedResponsavelEndereco =
        parseOptionalString(responsavelEndereco);

      const parsedPlanoSaude =
        parseOptionalString(planoSaude);

      const parsedContatoEmergencia =
        parseOptionalString(contatoEmergencia);

      const parsedHistoricoMedico =
        parseOptionalString(historicoMedico);

      const parsedAlergias =
        parseOptionalString(alergias);

      const parsedDiagnosticos =
        parseOptionalString(diagnosticos);

      const parsedRestricaoAlimentar =
        parseOptionalString(restricaoAlimentar);

      const parsedObservacoes =
        parseOptionalString(observacoes);

      /*
       * ============================================================
       * CRIAÇÃO DO PACIENTE
       * ============================================================
       */

      const patient = await prisma.patient.create({
        data: {
          nome: nomeNormalizado,
          dataNascimento: parsedDataNascimento,

          ...(parsedCpf !== undefined && {
            cpf: parsedCpf,
          }),

          ...(parsedRg !== undefined && {
            rg: parsedRg,
          }),

          ...(parsedNaturalidade !== undefined && {
            naturalidade: parsedNaturalidade,
          }),

          ...(parsedEstadoCivil !== undefined && {
            estadoCivil: parsedEstadoCivil,
          }),

          ...(parsedCartaoSus !== undefined && {
            cartaoSus: parsedCartaoSus,
          }),

          ...(parsedFotoUrl !== undefined && {
            fotoUrl: parsedFotoUrl,
          }),

          ...(parsedQuartoLeito !== undefined && {
            quartoLeito: parsedQuartoLeito,
          }),

          ...(parsedGenero !== undefined && {
            genero: parsedGenero,
          }),

          responsavel: responsavelNormalizado,
          telefone: telefoneNormalizado,

          ...(parsedResponsavelCpf !== undefined && {
            responsavelCpf: parsedResponsavelCpf,
          }),

          ...(parsedResponsavelGrauParentesco !== undefined && {
            responsavelGrauParentesco:
              parsedResponsavelGrauParentesco,
          }),

          ...(parsedResponsavelEmail !== undefined && {
            responsavelEmail: parsedResponsavelEmail,
          }),

          ...(parsedResponsavelEndereco !== undefined && {
            responsavelEndereco: parsedResponsavelEndereco,
          }),

          ...(parsedTipoSanguineo !== undefined && {
            tipoSanguineo: parsedTipoSanguineo,
          }),

          ...(parsedPlanoSaude !== undefined && {
            planoSaude: parsedPlanoSaude,
          }),

          ...(parsedContatoEmergencia !== undefined && {
            contatoEmergencia: parsedContatoEmergencia,
          }),

          ...(parsedGrauDependencia !== undefined && {
            grauDependencia: parsedGrauDependencia,
          }),

          ...(parsedHistoricoMedico !== undefined && {
            historicoMedico: parsedHistoricoMedico,
          }),

          ...(parsedAlergias !== undefined && {
            alergias: parsedAlergias,
          }),

          ...(parsedDiagnosticos !== undefined && {
            diagnosticos: parsedDiagnosticos,
          }),

          ...(parsedRestricaoAlimentar !== undefined && {
            restricaoAlimentar: parsedRestricaoAlimentar,
          }),

          ...(parsedObservacoes !== undefined && {
            observacoes: parsedObservacoes,
          }),

          ...(parsedDataInternacao !== undefined && {
            dataInternacao: parsedDataInternacao,
          }),

          ...(parsedDataAlta !== undefined && {
            dataAlta: parsedDataAlta,
          }),
        },
      });

      /*
       * ============================================================
       * AUDITORIA
       * ============================================================
       */

      await createAuditLog({
        userId,
        acao: AuditActions.CREATE,
        entidade: "PATIENT",
        entidadeId: patient.id,
        descricao:
          `Paciente "${patient.nome}" cadastrado por ${userRole}.`,
      });

      return response.status(201).json(patient);
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);

      /*
       * CPF é @unique no Prisma.
       */
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return response.status(409).json({
          error:
            "Já existe um paciente cadastrado com um dos dados únicos informados.",
        });
      }

      return response.status(500).json({
        error: "Erro ao cadastrar paciente.",
      });
    }
  }
}