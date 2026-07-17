import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppointmentStatus } from "@prisma/client";


export class ListTodayAppointmentsController {

  async handle(
    request: Request,
    response: Response
  ) {

    const startOfDay = new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );


    const endOfDay = new Date();

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );


    const appointments =
      await prisma.appointment.findMany({

        where: {

          dataHora: {
            gte: startOfDay,
            lte: endOfDay,
          },

          status: {
            not: AppointmentStatus.CANCELADO,
          },

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


    return response.json(
      appointments
    );

  }

}