import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

      appointments.map((appointment) => ({

        id:
          appointment.id,

        titulo:
          appointment.titulo,

        dataHora:
          appointment.dataHora,

        observacoes:
          appointment.observacoes,

        status:
          appointment.status,


        paciente: {

          id:
            appointment.patient.id,

          nome:
            appointment.patient.nome,

        },


        profissional: {

          id:
            appointment.user.id,

          nome:
            appointment.user.nome,

          cargo:
            appointment.user.cargo,

        },


      }))

    );

  }

}