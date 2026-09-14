import { Request, Response } from "express";
import { AuditActions } from "../constants/auditActions";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";

type AppointmentRequestBody = Record<string, unknown>;

function isAppointmentRequestBody(
  value: unknown,
): value is AppointmentRequestBody {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

export class CreateAppointmentController {
  async handle(
    request: Request,
    response: Response,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const body: unknown = request.body;

      if (!isAppointmentRequestBody(body)) {
        return response.status(400).json({
          error: "Corpo da requisição inválido.",
        });
      }

      const {
        titulo,
        dataHora,
        observacoes,
        local,
        patientId,
      } = body;

      if (
        !isNonEmptyString(titulo) ||
        !isNonEmptyString(patientId) ||
        !isNonEmptyString(dataHora)
      ) {
        return response.status(400).json({
          error:
            "Título, data/hora e paciente são obrigatórios.",
        });
      }

      if (
        observacoes !== undefined &&
        observacoes !== null &&
        typeof observacoes !== "string"
      ) {
        return response.status(400).json({
          error:
            "Observações devem ser uma string ou nulo.",
        });
      }

      if (
        local !== undefined &&
        local !== null &&
        !isNonEmptyString(local)
      ) {
        return response.status(400).json({
          error:
            "Local deve ser uma string não vazia ou nulo.",
        });
      }

      const normalizedTitulo = titulo.trim();
      const normalizedPatientId = patientId.trim();
      const normalizedObservacoes =
        typeof observacoes === "string"
          ? observacoes.trim()
          : observacoes ?? null;
      const normalizedLocal =
        typeof local === "string"
          ? local.trim()
          : local ?? null;

      const appointmentDate = new Date(
        dataHora.trim(),
      );

      if (Number.isNaN(appointmentDate.getTime())) {
        return response.status(400).json({
          error: "Data do agendamento inválida.",
        });
      }

      const patient = await prisma.patient.findFirst({
        where: {
          id: normalizedPatientId,
          ativo: true,
        },
        select: {
          id: true,
          nome: true,
        },
      });

      if (!patient) {
        return response.status(404).json({
          error:
            "Paciente não encontrado ou está inativo.",
        });
      }

      const appointment =
        await prisma.appointment.create({
          data: {
            titulo: normalizedTitulo,
            dataHora: appointmentDate,
            observacoes: normalizedObservacoes,
            local: normalizedLocal,
            patientId: normalizedPatientId,
            userId,
          },
        });

      await createAuditLog({
        userId,
        acao: AuditActions.CREATE,
        entidade: "APPOINTMENT",
        entidadeId: appointment.id,
        descricao:
          `Agendamento "${appointment.titulo}" criado ` +
          `para o paciente "${patient.nome}".`,
      });

      return response.status(201).json(appointment);
    } catch (error) {
      console.error(
        "Erro ao criar agendamento:",
        error,
      );

      return response.status(500).json({
        error: "Erro ao criar agendamento.",
      });
    }
  }
}

