import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppointmentStatus } from "@prisma/client";

import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";


export class UpdateAppointmentStatusController {
  async handle(request: Request, response: Response) {

    const appointmentId = request.params.id as string;

    const { status } = request.body;


    if (
      !Object.values(AppointmentStatus).includes(status)
    ) {
      return response.status(400).json({
        error: "Status inválido.",
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


    const updatedAppointment =
      await prisma.appointment.update({

        where: {
          id: appointmentId,
        },

        data: {
          status,
        },

      });


    const userId = request.user?.id;


    if (userId) {
      await createAuditLog({

        userId,

        acao: AuditActions.UPDATE,

        entidade: "APPOINTMENT",

        entidadeId: appointmentId,

        descricao:
          `Status do agendamento "${appointment.titulo}" ` +
          `do paciente "${appointment.patient.nome}" ` +
          `alterado para ${status}.`,

      });
    }


    return response.json(updatedAppointment);
  }
}