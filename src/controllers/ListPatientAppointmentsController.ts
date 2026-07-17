import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppointmentStatus } from "@prisma/client";


export class ListPatientAppointmentsController {

  async handle(
    request: Request,
    response: Response
  ) {

    const patientId = request.params.id as string;

    const status =
      request.query.status as string | undefined;


    const patient =
      await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
      });


    if (!patient) {
      return response.status(404).json({
        error: "Paciente não encontrado.",
      });
    }


    const whereStatus =
      status &&
      Object.values(AppointmentStatus)
        .includes(status as AppointmentStatus)
        ? {
            status:
              status as AppointmentStatus,
          }
        : {};


    const appointments =
      await prisma.appointment.findMany({

        where: {

          patientId,

          ...whereStatus,

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


    return response.json(
      appointments
    );

  }

}