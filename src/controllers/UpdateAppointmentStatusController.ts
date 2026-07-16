import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppointmentStatus } from "../constants/appointmentStatus";


const validStatus = Object.values(
 AppointmentStatus
);

export class UpdateAppointmentStatusController {
  async handle(request: Request, response: Response) {
    const appointmentId = request.params.id as string;

    const { status } = request.body;

    const validStatus = Object.values(AppointmentStatus);
    
    if (!validStatus.includes(status)) {
      return response.status(400).json({
        error: "Status inválido",
      });
    }

    const appointmentExists =
      await prisma.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });

    if (!appointmentExists) {
      return response.status(404).json({
        error: "Atendimento não encontrado",
      });
    }

    const appointment =
      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status,
        },
      });

    return response.json(appointment);
  }
}