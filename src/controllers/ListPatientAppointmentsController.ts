import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientAppointmentsController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId,
      },
      include: {
        patient:{
          select:{
            id:true,
            nome:true,
          }
        },
        user:{
          select:{
            id:true,
            nome:true,
            cargo:true,
          }
        },
      },
      orderBy: {
        dataHora: "asc",
      },
    });

    return response.json(appointments);
  }
}