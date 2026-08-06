import { Request, Response } from "express";
import { DocumentType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";
import { randomUUID } from "crypto";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class UploadPatientDocumentController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const {
      nome,
      tipo,
    } = request.body;

    const file = request.file as Express.Multer.File;

    if (!file) {
      return response.status(400).json({
        error: "Arquivo não enviado",
      });
    }

    if (!nome) {
      return response.status(400).json({
        error: "Nome obrigatório",
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

    const documentType =
      tipo && Object.values(DocumentType).includes(tipo)
        ? tipo
        : DocumentType.OUTRO;


    const fileExt = file.originalname
      .split(".")
      .pop();

    const fileName = `${randomUUID()}.${fileExt}`;


    const { error } = await supabase.storage
      .from("documents")
      .upload(
        fileName,
        file.buffer,
        {
          contentType: file.mimetype,
          upsert: false,
        }
      );


    if (error) {
      console.error(error);

      return response.status(500).json({
        error: "Erro ao enviar arquivo",
      });
    }


    const document = await prisma.patientDocument.create({
      data: {
        nome,
        arquivo: fileName,
        tipo: documentType,
        patientId,
      },
    });


    if (request.user?.id) {
      await createAuditLog({
        userId: request.user.id,
        acao: AuditActions.CREATE,
        entidade: "PATIENT_DOCUMENT",
        entidadeId: document.id,
        descricao:
          `Documento ${nome} enviado para o paciente ${patientExists.nome}`,
      });
    }


    return response.status(201).json(document);
  }
}