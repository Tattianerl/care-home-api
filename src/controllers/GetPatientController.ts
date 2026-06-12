import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export class GetPatientController {
  async handle(request: Request, response: Response) {
    const id = request.params.id as string;

    const patient = await prisma.patient.findFirst({
      where: {
        id,
        ativo: true,
      },
      include: {
        evolutions: {
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
                cargo: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    return response.json(patient);
  }
}