import { Request, Response } from "express";
import { Prisma, UserRole } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

function isValidDate(value: unknown): boolean {
  const date = new Date(String(value));
  return !Number.isNaN(date.getTime());
}

export class UpdatePatientStatusController {
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

    /*
     * O controle de autorização também deve existir na rota
     * através do roleMiddleware(UserRole.COORDENADOR).
     *
     * Mantemos esta verificação no controller como defesa adicional.
     */

    if (userRole !== UserRole.COORDENADOR) {
      return response.status(403).json({
        error:
          "Seu cargo não possui permissão para alterar o status institucional do paciente.",
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
       * SOMENTE ESTES CAMPOS PERTENCEM AO STATUS INSTITUCIONAL
       * ============================================================
       */

      const allowedFields = [
        "dataInternacao",
        "dataAlta",
        "falecido",
      ];

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
        dataInternacao,
        dataAlta,
        falecido,
      } = body;

      /*
       * ============================================================
       * VALIDAÇÃO
       * ============================================================
       */

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
       * CONVERSÃO
       * ============================================================
       */

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

      /*
       * ============================================================
       * CONSISTÊNCIA DAS DATAS
       * ============================================================
       */

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
       * MONTAGEM DO UPDATE
       * ============================================================
       */

      const data: Prisma.PatientUpdateInput = {};

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
            "Nenhum campo válido foi informado para atualização do status.",
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
          `Status institucional do paciente "${patient.nome}" ` +
          `atualizado por ${userRole}. ` +
          `Campos alterados: ${changedFields.join(", ")}.`,
      });

      return response.status(200).json(patient);
    } catch (error) {
      console.error(
        "Erro ao atualizar status institucional do paciente:",
        error
      );

      return response.status(500).json({
        error:
          "Erro ao atualizar status institucional do paciente.",
      });
    }
  }
}

