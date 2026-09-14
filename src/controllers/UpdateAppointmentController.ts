import { Request, Response } from "express";
import { AuditActions } from "../constants/auditActions";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";

type AppointmentRequestBody = Record<string, unknown>;

const allowedAppointmentFields = new Set([
  "titulo",
  "dataHora",
  "observacoes",
  "local",
]);

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

function formatAuditValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "vazio";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

export class UpdateAppointmentController {
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
      const appointmentId = request.params.id;

      if (
        !appointmentId ||
        Array.isArray(appointmentId)
      ) {
        return response.status(400).json({
          error: "ID do agendamento inválido.",
        });
      }

      const body: unknown = request.body;

      if (!isAppointmentRequestBody(body)) {
        return response.status(400).json({
          error: "Corpo da requisição inválido.",
        });
      }

      const hasInvalidField = Object.keys(body).some(
        (field) =>
          !allowedAppointmentFields.has(field),
      );

      if (hasInvalidField) {
        return response.status(400).json({
          error:
            "O corpo da requisição contém campos não permitidos.",
        });
      }

      const {
        titulo,
        dataHora,
        observacoes,
        local,
      } = body;

      if (
        !isNonEmptyString(titulo) ||
        !isNonEmptyString(dataHora)
      ) {
        return response.status(400).json({
          error:
            "Título e data/hora são obrigatórios.",
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
        typeof local !== "string"
      ) {
        return response.status(400).json({
          error:
            "Local deve ser uma string ou nulo.",
        });
      }

      const appointmentDate =
        new Date(dataHora.trim());

      if (
        Number.isNaN(
          appointmentDate.getTime(),
        )
      ) {
        return response.status(400).json({
          error:
            "Data do agendamento inválida.",
        });
      }

      const appointment =
        await prisma.appointment.findUnique({
          where: {
            id: appointmentId,
          },
          include: {
            patient: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        });

      if (!appointment) {
        return response.status(404).json({
          error:
            "Agendamento não encontrado.",
        });
      }

      const normalizedTitulo = titulo.trim();

      const normalizedObservacoes =
        typeof observacoes === "string"
          ? observacoes.trim()
          : observacoes ?? null;

      const normalizedLocal =
        typeof local === "string"
          ? local.trim()
          : local ?? null;

      const changes: string[] = [];

      if (
        appointment.titulo !==
        normalizedTitulo
      ) {
        changes.push(
          `título: "${appointment.titulo}" → "${normalizedTitulo}"`,
        );
      }

      if (
        appointment.dataHora.getTime() !==
        appointmentDate.getTime()
      ) {
        changes.push(
          `data/hora: "${formatAuditValue(appointment.dataHora)}" → "${formatAuditValue(appointmentDate)}"`,
        );
      }

      if (
        appointment.observacoes !==
        normalizedObservacoes
      ) {
        changes.push(
          `observações: "${formatAuditValue(appointment.observacoes)}" → "${formatAuditValue(normalizedObservacoes)}"`,
        );
      }

      if (
        appointment.local !==
        normalizedLocal
      ) {
        changes.push(
          `local: "${formatAuditValue(appointment.local)}" → "${formatAuditValue(normalizedLocal)}"`,
        );
      }

      const updatedAppointment =
        await prisma.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            titulo: normalizedTitulo,
            dataHora: appointmentDate,
            observacoes: normalizedObservacoes,
            local: normalizedLocal,
          },
        });

      if (changes.length > 0) {
        await createAuditLog({
          userId,
          acao: AuditActions.UPDATE,
          entidade: "APPOINTMENT",
          entidadeId: appointmentId,
          descricao:
            `Agendamento "${updatedAppointment.titulo}" ` +
            `do paciente "${appointment.patient.nome}" ` +
            `atualizado. Alterações: ${changes.join("; ")}.`,
        });
      }

      return response.status(200).json(
        updatedAppointment,
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar agendamento:",
        error,
      );

      return response.status(500).json({
        error:
          "Erro ao atualizar agendamento.",
      });
    }
  }
}

