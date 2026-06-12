import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        assinatura: file.filename,
      },
    });

    return response.status(200).json({
      message: "Assinatura enviada com sucesso",
      assinatura: file.filename,
      url: `http://localhost:3333/files/${file.filename}`,
    });
  }
}