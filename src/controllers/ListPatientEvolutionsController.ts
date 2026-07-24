import { Request, Response } from "express";

import { prisma } from "../lib/prisma";


export class ListPatientEvolutionsController {

  async handle(
    request: Request,
    response: Response
  ) {

    const patientId = request.params.id as string;


    const patient = await prisma.patient.findUnique({

      where: {
        id: patientId,
      },

      select: {

        id: true,
        nome: true,

      },

    });


    if (!patient) {

      return response.status(404).json({

        error: "Paciente não encontrado.",

      });

    }



    const evolutions = await prisma.evolution.findMany({

      where: {

        patientId,

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
            assinatura: true,

          },

        },

      },


      orderBy: {

        createdAt: "desc",

      },

    });



    return response.json({

      patient,

      total: evolutions.length,

      evolutions,

    });

  }

}