import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class AppointmentsByMonthController {
  async handle(request: Request, response: Response) {
    try {
      const year = request.query.year as string | undefined;
      const month = request.query.month as string | undefined;

      if (year !== undefined && !/^\d{4}$/.test(year)) {
        return response.status(400).json({
          error: "Ano inválido. Informe o ano no formato YYYY.",
        });
      }

      if (
        month !== undefined &&
        (!/^\d{1,2}$/.test(month) ||
          Number(month) < 1 ||
          Number(month) > 12)
      ) {
        return response.status(400).json({
          error: "Mês inválido. Informe um valor entre 1 e 12.",
        });
      }

      const appointments = await prisma.appointment.findMany({
        select: {
          dataHora: true,
        },
        orderBy: {
          dataHora: "asc",
        },
      });

      const grouped: Record<string, number> = {};

      appointments.forEach((appointment) => {
        const date = new Date(appointment.dataHora);

        const appointmentYear = String(date.getFullYear());
        const appointmentMonth = String(date.getMonth() + 1).padStart(2, "0");

        if (year && appointmentYear !== year) {
          return;
        }

        if (
          month &&
          appointmentMonth !== String(Number(month)).padStart(2, "0")
        ) {
          return;
        }

        const key = `${appointmentYear}-${appointmentMonth}`;

        grouped[key] = (grouped[key] || 0) + 1;
      });

      const result = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, total]) => ({
          month,
          total,
        }));

      return response.status(200).json(result);
    } catch (error) {
      console.error(
        "Erro ao carregar agendamentos por mês:",
        error
      );

      return response.status(500).json({
        error: "Erro ao carregar agendamentos por mês.",
      });
    }
  }
}

