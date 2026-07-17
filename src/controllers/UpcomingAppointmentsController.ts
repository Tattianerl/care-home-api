import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppointmentStatus } from "@prisma/client";


export class UpcomingAppointmentsController {

  async handle(
    request: Request,
    response: Response
  ) {

    const today = new Date();

    const next7Days = new Date();

    next7Days.setDate(
      today.getDate() + 7
    );


    const appointments =
      await prisma.appointment.findMany({

        where: {

          dataHora: {
            gte: today,
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


    return response.status(200).json(
      appointments
    );

  }

}