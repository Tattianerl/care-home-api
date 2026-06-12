import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class UpcomingAppointmentsController {
  async handle(request: Request, response: Response) {

    const today = new Date();

    const next7Days = new Date();

    next7Days.setDate(today.getDate() + 7);

    const appointments = await prisma.appointment.findMany({
      where: {
        dataHora: {
          gte: today,
          lte: next7Days,
        },
      },
      include: {
        patient: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        dataHora: "asc",
      },
    });

    return response.status(200).json(appointments);
  }
}