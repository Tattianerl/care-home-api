import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase"; 

export class DownloadPatientDocumentController {
  async handle(request: Request, response: Response) {
    const documentId = request.params.id as string;

    console.log("ID recebido:", documentId);

    // 1. Busca a referência do documento no banco de dados
    const document = await prisma.patientDocument.findUnique({
      where: {
        id: documentId,
      },
    });

    console.log("Documento encontrado:", document);

    if (!document) {
      console.log("Documento não encontrado no banco.");
      return response.status(404).json({
        error: "Documento não encontrado",
      });
    }

    // 2. Faz o download do arquivo diretamente do Supabase Storage
    // Substitua 'seu-nome-de-bucket' pelo nome real do seu bucket no Supabase
    const { data, error } = await supabase.storage
      .from("documents") 
      .download(document.arquivo);

    if (error || !data) {
      console.log("Erro ao baixar do Supabase Storage:", error);
      return response.status(404).json({
        error: "Arquivo não encontrado no armazenamento",
      });
    }

    // 3. Transforma o arquivo (Blob) em um Buffer para o Express conseguir enviar
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Configura os headers para forçar o download no navegador com o nome original
    response.setHeader("Content-Type", data.type);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.arquivo}"`
    );

    // 5. Envia o buffer do arquivo
    return response.send(buffer);
  }
}