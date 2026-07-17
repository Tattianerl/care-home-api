import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppointmentStatus } from "@prisma/client";


export class ListAppointmentsController {

  async handle(
    request: Request,
    response: Response
  ) {

    const {
      status,
      patientId,
      userId,
      startDate,
      endDate,
    } = request.query;


    const where: any = {};


    if (patientId) {
      where.patientId = patientId;
    }


    if (userId) {
      where.userId = userId;
    }


    if (
      status &&
      Object.values(AppointmentStatus)
        .includes(
          status as AppointmentStatus
        )
    ) {

      where.status =
        status as AppointmentStatus;

    }


    if (startDate || endDate) {

      where.dataHora = {};

      if (startDate) {

        where.dataHora.gte =
          new Date(
            startDate as string
          );

      }


      if (endDate) {

        where.dataHora.lte =
          new Date(
            endDate as string
          );

      }

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


    return response.json(
      appointments
    );

  }

}