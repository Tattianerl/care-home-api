import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListTodayEvolutionsController {

  async handle(
    request: Request,
    response: Response
  ) {

    const start = new Date();

    start.setHours(0,0,0,0);


    const end = new Date();

    end.setHours(23,59,59,999);



    const evolutions =
      await prisma.evolution.findMany({

        where: {

          createdAt: {
            gte: start,
            lte: end,
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

              id:true,
              nome:true,
              cargo:true,

            },

          },

        },


        orderBy: {

          createdAt:"desc",

        },

      });



    return response.json({

      total: evolutions.length,

      evolutions,

    });

  }

}