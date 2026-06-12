import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class AppointmentsByMonthController {
  async handle(request: Request, response: Response) {

    const year = request.query.year as string | undefined;
    const month = request.query.month as string | undefined;

    const appointments = await prisma.appointment.findMany({
      select: {
        createdAt: true,
      },
    });

    const grouped: Record<string, number> = {};

    appointments.forEach((appointment) => {

      const date = new Date(appointment.createdAt);

      const appointmentYear = String(date.getFullYear());
      const appointmentMonth = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      if (year && appointmentYear !== year) {
        return;
      }

      if (month && appointmentMonth !== month) {
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

    return response.json(result);
  }
}