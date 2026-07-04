import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";
import { randomUUID } from "crypto";

export class UploadPatientDocumentController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;
    const { nome } = request.body;

    const file = request.file as Express.Multer.File;

    if (!file) {
      return response.status(400).json({ error: "Arquivo não enviado" });
    }

    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patientExists) {
      return response.status(404).json({ error: "Paciente não encontrado" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${randomUUID()}.${fileExt}`;

    // 🔥 UPLOAD PARA SUPABASE
    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao enviar arquivo" });
    }

    // salvar no banco SOMENTE o path
    const document = await prisma.patientDocument.create({
      data: {
        nome,
        arquivo: fileName,
        patientId,
      },
    });

    return response.status(201).json(document);
  }
}