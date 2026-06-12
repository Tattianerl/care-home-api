import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientMedicationsController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const medications = await prisma.medication.findMany({
      where: {
        patientId,
      },
      include: {
        user: {
          select: {
            nome: true,
            cargo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(medications);
  }
}