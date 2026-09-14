import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";

export class DownloadPatientDocumentController {
  async handle(request: Request, response: Response) {
    try {
      const documentId = String(request.params.id);

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

      // Documentos excluídos não podem mais ser baixados
      if (document.deletedAt) {
        return response.status(404).json({
          error: "Documento não encontrado",
        });
      }

      const { data, error } = await supabase.storage
        .from("documents")
        .download(document.arquivo);

      if (error || !data) {
        console.error(
          "Erro ao baixar documento do armazenamento:",
          error
        );

        return response.status(404).json({
          error: "Arquivo não encontrado no armazenamento",
        });
      }

      const arrayBuffer = await data.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      response.setHeader(
        "Content-Type",
        data.type || "application/octet-stream"
      );

      response.setHeader(
        "Content-Disposition",
        `attachment; filename="${document.nome}"`
      );

      return response.send(buffer);
    } catch (error) {
      console.error(
        "Erro ao baixar documento do paciente:",
        error
      );

      return response.status(500).json({
        error: "Erro ao baixar documento",
      });
    }
  }
}