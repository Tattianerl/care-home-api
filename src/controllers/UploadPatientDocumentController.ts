import { Request, Response } from "express";
import { DocumentType, UserRole } from "@prisma/client";
import { randomUUID } from "crypto";

import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

const documentUploadRoles: UserRole[] = [
  UserRole.COORDENADOR,
  UserRole.ASSISTENTE_SOCIAL,
  UserRole.ENFERMEIRO,
  UserRole.MEDICO,
  UserRole.RECEPCAO,
];

export class UploadPatientDocumentController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;
    const userRole = request.user?.cargo as UserRole | undefined;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    if (!userRole) {
      return response.status(403).json({
        error: "Cargo do usuário não identificado.",
      });
    }

    /*
     * ============================================================
     * AUTORIZAÇÃO
     * ============================================================
     *
     * Segunda camada de segurança além do roleMiddleware da rota.
     */

    if (!documentUploadRoles.includes(userRole)) {
      return response.status(403).json({
        error:
          "Seu cargo não possui permissão para enviar documentos de pacientes.",
      });
    }

    const { id: patientId } = request.params;

    if (!patientId || Array.isArray(patientId)) {
      return response.status(400).json({
        error: "ID do paciente inválido.",
      });
    }

    const nome =
      typeof request.body?.nome === "string"
        ? request.body.nome.trim()
        : "";

    const tipo = request.body?.tipo;
    const file = request.file;

    /*
     * ============================================================
     * VALIDAÇÕES BÁSICAS
     * ============================================================
     */

    if (!file) {
      return response.status(400).json({
        error: "Arquivo não enviado.",
      });
    }

    if (!nome) {
      return response.status(400).json({
        error: "Nome do documento é obrigatório.",
      });
    }

    /*
     * ============================================================
     * TIPO DO DOCUMENTO
     * ============================================================
     *
     * Tipo omitido -> OUTRO.
     * Tipo informado e inválido -> 400.
     */

    let documentType: DocumentType = DocumentType.OUTRO;

    if (tipo !== undefined && tipo !== null && tipo !== "") {
      if (
        typeof tipo !== "string" ||
        !Object.values(DocumentType).includes(
          tipo as DocumentType
        )
      ) {
        return response.status(400).json({
          error: "Tipo de documento inválido.",
        });
      }

      documentType = tipo as DocumentType;
    }

    try {
      /*
       * ============================================================
       * PACIENTE
       * ============================================================
       */

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
          error: "Paciente não encontrado.",
        });
      }

      /*
       * ============================================================
       * STORAGE
       * ============================================================
       */

      const extension =
        file.originalname.includes(".")
          ? file.originalname.split(".").pop()?.toLowerCase()
          : undefined;

      const fileName = `${randomUUID()}${
        extension ? `.${extension}` : ""
      }`;

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
          error: "Erro ao enviar arquivo.",
        });
      }

      /*
       * ============================================================
       * BANCO DE DADOS
       * ============================================================
       */

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

        /*
         * Evita arquivo órfão no Storage.
         */

        const { error: removeError } = await supabase.storage
          .from("documents")
          .remove([fileName]);

        if (removeError) {
          console.error(
            "Erro ao remover arquivo órfão do Storage:",
            removeError
          );
        }

        return response.status(500).json({
          error: "Erro ao registrar documento.",
        });
      }

      /*
       * ============================================================
       * AUDITORIA
       * ============================================================
       *
       * O AuditLog identifica quem fez o upload através do userId.
       * Isso permite rastrear o responsável sem duplicar esse dado
       * dentro de PatientDocument.
       */

      try {
        await createAuditLog({
          userId,
          acao: AuditActions.CREATE,
          entidade: "PATIENT_DOCUMENT",
          entidadeId: document.id,
          descricao:
            `Documento "${nome}" (${documentType}) enviado para o ` +
            `paciente "${patientExists.nome}" por ${userRole}.`,
        });
      } catch (auditError) {
        /*
         * O documento já foi criado. Falha de auditoria não deve
         * apagar o documento do paciente.
         *
         * O erro é registrado para investigação.
         */

        console.error(
          "Erro ao registrar auditoria do documento:",
          auditError
        );
      }

      /*
       * ============================================================
       * RESPOSTA
       * ============================================================
       */

      return response.status(201).json(document);
    } catch (error) {
      console.error(
        "Erro ao enviar documento do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro ao enviar documento.",
      });
    }
  }
}
