import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListTodayAppointmentsController {
  async handle(request: Request, response: Response) {

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        dataHora: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: {
          select: {
            nome: true,
          },
        },
        user: {
          select: {
            nome: true,
            cargo: true,
          },
        },
      },
      orderBy: {
        dataHora: "asc",
      },
    });

    return response.json(appointments);
  }
}