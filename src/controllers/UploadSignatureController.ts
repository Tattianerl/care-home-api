import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";

export class UploadSignatureController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const file = request.file;

    if (!file) {
      return response.status(400).json({
        error: "Arquivo não enviado",
      });
    }

    const fileName = `signatures/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      return response.status(500).json({
        error: error.message,
      });
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        assinatura: fileName,
      },
    });

    return response.status(200).json({
      message: "Assinatura enviada com sucesso",
      assinatura: fileName,
    });
  }
}