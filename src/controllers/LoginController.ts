import { Request, Response } from "express";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

export class LoginController {
  async handle(request: Request, response: Response) {
    const { email, senha } = request.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return response.status(401).json({
        error: "Email ou senha inválidos",
      });
    }

    const senhaMatch = await compare(senha, user.senha);

    if (!senhaMatch) {
      return response.status(401).json({
        error: "Email ou senha inválidos",
      });
    }

    const token = jwt.sign(
      {
        cargo: user.cargo,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "7d",
      }
    );

    return response.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
      },
      token,
    });
  }
}