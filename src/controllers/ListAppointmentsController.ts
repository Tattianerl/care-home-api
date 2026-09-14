import { AppointmentStatus } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

function isValidDate(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isValidAppointmentStatus(
  value: string,
): value is AppointmentStatus {
  return Object.values(AppointmentStatus).includes(
    value as AppointmentStatus,
  );
}

export class ListAppointmentsController {
  async handle(
    request: Request,
    response: Response,
  ) {
    try {
      const {
        status,
        patientId,
        userId,
        startDate,
        endDate,
      } = request.query;

      const where: {
        patientId?: string;
        userId?: string;
        status?: AppointmentStatus;
        dataHora?: {
          gte?: Date;
          lte?: Date;
        };
      } = {};

      if (patientId !== undefined) {
        if (
          typeof patientId !== "string" ||
          !patientId.trim()
        ) {
          return response.status(400).json({
            error: "ID do paciente inválido.",
          });
        }

        where.patientId = patientId.trim();
      }

      if (userId !== undefined) {
        if (
          typeof userId !== "string" ||
          !userId.trim()
        ) {
          return response.status(400).json({
            error: "ID do usuário inválido.",
          });
        }

        where.userId = userId.trim();
      }

      if (status !== undefined) {
        if (
          typeof status !== "string" ||
          !isValidAppointmentStatus(status)
        ) {
          return response.status(400).json({
            error: "Status de agendamento inválido.",
          });
        }

        where.status = status;
      }

      if (startDate !== undefined) {
        if (
          typeof startDate !== "string" ||
          !isValidDate(startDate)
        ) {
          return response.status(400).json({
            error: "Data inicial inválida.",
          });
        }

        where.dataHora = {
          ...(where.dataHora ?? {}),
          gte: new Date(startDate),
        };
      }

      if (endDate !== undefined) {
        if (
          typeof endDate !== "string" ||
          !isValidDate(endDate)
        ) {
          return response.status(400).json({
            error: "Data final inválida.",
          });
        }

        where.dataHora = {
          ...(where.dataHora ?? {}),
          lte: new Date(endDate),
        };
      }

      if (
        where.dataHora?.gte &&
        where.dataHora?.lte &&
        where.dataHora.gte > where.dataHora.lte
      ) {
        return response.status(400).json({
          error:
            "A data inicial não pode ser posterior à data final.",
        });
      }

      const appointments =
        await prisma.appointment.findMany({
          where,
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
            dataHora: "asc",
          },
        });

      return response.status(200).json(appointments);
    } catch (error) {
      console.error(
        "Erro ao listar agendamentos:",
        error,
      );

      return response.status(500).json({
        error: "Erro ao listar agendamentos.",
      });
    }
  }
}

