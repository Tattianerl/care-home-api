import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class PatientsByMonthController {
  async handle(request: Request, response: Response) {
    const patients = await prisma.patient.findMany({
      select: {
        createdAt: true,
      },
    });

    const grouped: Record<string, number> = {};

    patients.forEach((patient) => {
      const date = new Date(patient.createdAt);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      grouped[key] = (grouped[key] || 0) + 1;
    });

    return response.json(grouped);
  }
}