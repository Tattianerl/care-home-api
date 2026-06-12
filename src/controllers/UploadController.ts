import { Request, Response } from "express";

export class UploadController {
  async handle(request: Request, response: Response) {

    console.log(request.file);

    const file = request.file;

    if (!file) {
      return response.status(400).json({
        error: "Arquivo não enviado",
      });
    }

    return response.status(201).json({
      message: "Upload realizado com sucesso",
      fileName: file.filename,
      fileUrl: `http://localhost:3333/files/${file.filename}`,
    });
  }
}