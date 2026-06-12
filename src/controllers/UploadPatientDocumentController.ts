import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class UploadPatientDocumentController {
  async handle(request: Request, response: Response) {

    console.log("BODY:", request.body);
    console.log("FILE:", request.file);
    console.log("HEADERS:", request.headers["content-type"]);

    const patientId = request.params.id as string;

    const { nome } = request.body;

    if (!nome) {
      return response.status(400).json({
        error: "Nome do documento é obrigatório",
      });
    }

    const file = request.file;

    if (!file) {
      return response.status(400).json({
        error: "Arquivo não enviado",
      });
    }

    const patientExists = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patientExists) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    const document = await prisma.patientDocument.create({
      data: {
        nome,
        arquivo: file.filename,
        patientId,
      },
    });

    return response.status(201).json(document);
  }
}