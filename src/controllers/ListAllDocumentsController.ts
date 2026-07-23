// src/controllers/ListAllDocumentsController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListAllDocumentsController {
  async handle(request: Request, response: Response) {
    try {
      const documents = await prisma.patientDocument.findMany({
        where: {
          deletedAt: null, 
        },
        include: {
          patient: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc", 
        },
      });

      return response.json(documents);
    } catch (error) {
      console.error("Erro ao listar todos os documentos:", error);
      return response.status(500).json({
        error: "Erro interno ao listar documentos.",
      });
    }
  }
}