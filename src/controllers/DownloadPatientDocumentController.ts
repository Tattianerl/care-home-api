import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import path from "path";
import fs from "fs";

export class DownloadPatientDocumentController {
  async handle(request: Request, response: Response) {
    const documentId = request.params.id as string;

    const document = await prisma.patientDocument.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return response.status(404).json({
        error: "Documento não encontrado",
      });
    }

    const filePath = path.resolve(
      process.cwd(),
      "..",
      "..",
      "uploads",
      document.arquivo
    );

    // Validação do arquivo físico
    if (!fs.existsSync(filePath)) {
      return response.status(404).json({
        error: "Arquivo físico não encontrado",
      });
    }

    return response.download(filePath, `${document.nome}.pdf`);
  }
}