import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import path from "path";
import fs from "fs";

export class DownloadPatientDocumentController {
  async handle(request: Request, response: Response) {
    const documentId = request.params.id as string;

    console.log("ID recebido:", documentId);

    const document = await prisma.patientDocument.findUnique({
      where: {
        id: documentId,
      },
    });

    console.log("Documento encontrado:", document);

    if (!document) {
      return response.status(404).json({
        error: "Documento não encontrado",
      });
    }

    const filePath = path.resolve(
      process.cwd(),
      "uploads",
      document.arquivo
    );

    console.log("Caminho do arquivo:", filePath);
    console.log("Arquivo existe?", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      return response.status(404).json({
        error: "Arquivo físico não encontrado",
      });
    }

    const extension = path.extname(document.arquivo);
    const downloadName = `${document.nome}${extension}`;

    return response.download(filePath, downloadName);
  }
}