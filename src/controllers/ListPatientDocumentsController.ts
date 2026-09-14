import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientDocumentsController {
  async handle(request: Request, response: Response) {
    try {
      const patientId = String(request.params.id);

      if (!patientId) {
        return response.status(400).json({
          error: "ID do paciente é obrigatório.",
        });
      }

      const documents = await prisma.patientDocument.findMany({
        where: {
          patientId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return response.status(200).json(documents);
    } catch (error) {
      console.error(
        "Erro ao listar documentos do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao listar documentos.",
      });
    }
  }
}

