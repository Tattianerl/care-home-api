import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetAppointmentController {
  async handle(
    request: Request,
    response: Response
  ) {
    try {
      const { id } = request.params;

      if (!id || Array.isArray(id)) {
        return response.status(400).json({
          error: "ID do agendamento inválido.",
        });
      }

      const appointment =
        await prisma.appointment.findUnique({
          where: {
            id,
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
        });

      if (!appointment) {
        return response.status(404).json({
          error: "Agendamento não encontrado.",
        });
      }

      return response.status(200).json(
        appointment
      );
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        error: "Erro ao buscar agendamento.",
      });
    }
  }
}