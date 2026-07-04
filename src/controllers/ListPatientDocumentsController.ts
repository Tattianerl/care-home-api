import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientDocumentsController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const documents = await prisma.patientDocument.findMany({
      where: {
        patientId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(documents);
  }
}