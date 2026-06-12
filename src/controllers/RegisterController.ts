import { Request, Response } from "express";
import { hash } from "bcryptjs";

import { prisma } from "../lib/prisma";

export class RegisterController {
  async handle(request: Request, response: Response) {
    const { nome, email, senha, cargo } = request.body;

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return response.status(400).json({
        error: "Usuário já existe",
      });
    }

    const senhaHash = await hash(senha, 8);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        cargo,
      },
    });

    return response.status(201).json(user);
  }
}