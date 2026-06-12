import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DocumentsByMonthController {
  async handle(request: Request, response: Response) {

    const year = request.query.year as string | undefined;
    const month = request.query.month as string | undefined;

    const documents = await prisma.patientDocument.findMany({
      select: {
        createdAt: true,
      },
    });

    const grouped: Record<string, number> = {};

    documents.forEach((document) => {

      const date = new Date(document.createdAt);

      const documentYear = String(date.getFullYear());
      const documentMonth = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      if (year && documentYear !== year) {
        return;
      }

      if (month && documentMonth !== month) {
        return;
      }

      const key = `${documentYear}-${documentMonth}`;

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