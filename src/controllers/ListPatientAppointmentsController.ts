import { Request, Response } from "express";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class ListPatientAppointmentsController {
  async handle(request: Request, response: Response) {
    try {
      const patientId = String(request.params.id ?? "").trim();
      const statusParam = request.query.status;

      if (!patientId) {
        return response.status(400).json({
          error: "ID do paciente é obrigatório.",
        });
      }

      const patient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
        select: {
          id: true,
        },
      });

      if (!patient) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      let status: AppointmentStatus | undefined;

      if (statusParam !== undefined) {
        const statusValue = String(statusParam).trim().toUpperCase();

        if (!Object.values(AppointmentStatus).includes(statusValue as AppointmentStatus)) {
          return response.status(400).json({
            error: "Status de agendamento inválido.",
          });
        }

        status = statusValue as AppointmentStatus;
      }

      const appointments = await prisma.appointment.findMany({
        where: {
          patientId,
          ...(status !== undefined && {
            status,
          }),
        },

        include: {
          patient: {
            select: {
              id: true,
              nome: true,
            },
          },

          user: {
            select: {
              id: true,
              nome: true,
              cargo: true,
            },
          },
        },

        orderBy: {
          dataHora: "desc",
        },
      });

      return response.status(200).json(appointments);
    } catch (error) {
      console.error(
        "Erro ao listar agendamentos do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro ao listar agendamentos do paciente.",
      });
    }
  }
}