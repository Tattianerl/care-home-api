import { Request, Response } from "express";
import { DocumentType } from "@prisma/client";
import { randomUUID } from "crypto";

import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class UploadPatientDocumentController {
  async handle(request: Request, response: Response) {
    const patientId = String(request.params.id);
    const nome =
      typeof request.body.nome === "string"
        ? request.body.nome.trim()
        : "";

    const tipo = request.body.tipo;
    const file = request.file;

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

    try {
      const patientExists = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
        select: {
          id: true,
          nome: true,
        },
      });

      if (!patientExists) {
        return response.status(404).json({
          error: "Paciente não encontrado",
        });
      }

      const documentType =
        typeof tipo === "string" &&
        Object.values(DocumentType).includes(tipo as DocumentType)
          ? (tipo as DocumentType)
          : DocumentType.OUTRO;

      const extension =
        file.originalname.includes(".")
          ? file.originalname.split(".").pop()?.toLowerCase()
          : undefined;

      const fileName = `${randomUUID()}${extension ? `.${extension}` : ""}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error(
          "Erro ao enviar documento para o armazenamento:",
          uploadError
        );

        return response.status(500).json({
          error: "Erro ao enviar arquivo",
        });
      }

      let document;

      try {
        document = await prisma.patientDocument.create({
          data: {
            nome,
            arquivo: fileName,
            tipo: documentType,
            patientId,
          },
        });
      } catch (databaseError) {
        console.error(
          "Erro ao registrar documento no banco de dados:",
          databaseError
        );

        // Remove o arquivo do Storage para evitar arquivo órfão.
        await supabase.storage
          .from("documents")
          .remove([fileName]);

        return response.status(500).json({
          error: "Erro ao registrar documento",
        });
      }

      if (request.user?.id) {
        await createAuditLog({
          userId: request.user.id,
          acao: AuditActions.CREATE,
          entidade: "PATIENT_DOCUMENT",
          entidadeId: document.id,
          descricao:
            `Documento "${nome}" enviado para o paciente "${patientExists.nome}".`,
        });
      }

      return response.status(201).json(document);
    } catch (error) {
      console.error(
        "Erro ao enviar documento do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro ao enviar documento",
      });
    }
  }
}