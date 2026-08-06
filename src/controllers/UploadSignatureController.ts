import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";

export class UploadSignatureController {
  async handle(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    const file = request.file;

    if (!file) {
      return response.status(400).json({
        error: "Nenhum arquivo foi enviado.",
      });
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return response.status(400).json({
        error: "Formato inválido. Utilize PNG, JPG ou WEBP.",
      });
    }

    const extension = file.originalname.split(".").pop();

    const fileName = `signature-${userId}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("signatures")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return response.status(500).json({
        error: uploadError.message,
      });
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("signatures")
      .getPublicUrl(fileName);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        assinatura: publicUrl,
      },
    });

    return response.status(200).json({
      message: "Assinatura enviada com sucesso.",
      assinatura: publicUrl,
    });
  }
}