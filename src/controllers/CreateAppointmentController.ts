import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class CreateAppointmentController {
  async handle(request: Request, response: Response) {
    const {
      titulo,
      dataHora,
      observacoes,
      patientId,
    } = request.body;

    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const patientExists = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patientExists) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        titulo,
        dataHora: new Date(dataHora),
        observacoes,
        patientId,
        userId,
      },
    });

    return response.status(201).json(appointment);
  }
}