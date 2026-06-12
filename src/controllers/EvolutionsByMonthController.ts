import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class EvolutionsByMonthController {
  async handle(request: Request, response: Response) {

    const year = request.query.year as string | undefined;
    const month = request.query.month as string | undefined;

    const evolutions = await prisma.evolution.findMany({
      select: {
        createdAt: true,
      },
    });

    const grouped: Record<string, number> = {};

    evolutions.forEach((evolution) => {

      const date = new Date(evolution.createdAt);

      const evolutionYear = String(date.getFullYear());
      const evolutionMonth = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      if (year && evolutionYear !== year) {
        return;
      }

      if (month && evolutionMonth !== month) {
        return;
      }

      const key = `${evolutionYear}-${evolutionMonth}`;

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