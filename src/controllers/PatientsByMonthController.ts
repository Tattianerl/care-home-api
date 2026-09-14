import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class PatientsByMonthController {
  async handle(request: Request, response: Response) {
    try {
      const patients = await prisma.patient.findMany({
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const grouped: Record<string, number> = {};

      patients.forEach((patient) => {
        const date = new Date(patient.createdAt);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const key = `${year}-${month}`;

        grouped[key] = (grouped[key] || 0) + 1;
      });

      return response.status(200).json(grouped);
    } catch (error) {
      console.error(
        "Erro ao carregar pacientes por mês:",
        error
      );

      return response.status(500).json({
        error: "Erro ao carregar pacientes por mês.",
      });
    }
  }
}

