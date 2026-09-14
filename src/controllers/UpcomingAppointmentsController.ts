import { AppointmentStatus } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class UpcomingAppointmentsController {
  async handle(
    request: Request,
    response: Response,
  ) {
    try {
      const now = new Date();

      const next7Days = new Date(now);
      next7Days.setDate(next7Days.getDate() + 7);

      const appointments =
        await prisma.appointment.findMany({
          where: {
            dataHora: {
              gte: now,
              lte: next7Days,
            },
            status: AppointmentStatus.AGENDADO,
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
            dataHora: "asc",
          },
        });

      return response.status(200).json(appointments);
    } catch (error) {
      console.error(
        "Erro ao buscar próximos agendamentos:",
        error,
      );

      return response.status(500).json({
        error:
          "Erro ao buscar próximos agendamentos.",
      });
    }
  }
}

