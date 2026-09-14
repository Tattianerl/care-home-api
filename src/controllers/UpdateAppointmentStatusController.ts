import { Request, Response } from "express";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class UpdateAppointmentStatusController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const appointmentId = String(request.params.id ?? "").trim();

      if (!appointmentId) {
        return response.status(400).json({
          error: "ID do agendamento é obrigatório.",
        });
      }

      const { status } = request.body;

      if (typeof status !== "string" || !status.trim()) {
        return response.status(400).json({
          error: "Status é obrigatório.",
        });
      }

      const normalizedStatus = status.trim().toUpperCase();

      if (
        !Object.values(AppointmentStatus).includes(
          normalizedStatus as AppointmentStatus
        )
      ) {
        return response.status(400).json({
          error: "Status inválido.",
        });
      }

      const appointmentStatus =
        normalizedStatus as AppointmentStatus;

      const appointment = await prisma.appointment.findUnique({
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
          error: "Agendamento não encontrado.",
        });
      }

      if (appointment.status === appointmentStatus) {
        return response.status(200).json(appointment);
      }

      const updatedAppointment =
        await prisma.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            status: appointmentStatus,
          },
        });

      await createAuditLog({
        userId,
        acao: AuditActions.UPDATE,
        entidade: "APPOINTMENT",
        entidadeId: appointmentId,
        descricao:
          `Status do agendamento "${appointment.titulo}" ` +
          `do paciente "${appointment.patient.nome}" ` +
          `alterado de "${appointment.status}" ` +
          `para "${appointmentStatus}".`,
      });

      return response.status(200).json(updatedAppointment);
    } catch (error) {
      console.error(
        "Erro ao atualizar status do agendamento:",
        error
      );

      return response.status(500).json({
        error: "Erro ao atualizar status do agendamento.",
      });
    }
  }
}