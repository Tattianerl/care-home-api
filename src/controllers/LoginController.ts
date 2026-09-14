import { Request, Response } from "express";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

export class LoginController {
  async handle(request: Request, response: Response) {
    try {
      const { email, senha } = request.body;

      if (typeof email !== "string" || !email.trim()) {
        return response.status(400).json({
          error: "E-mail é obrigatório.",
        });
      }

      if (typeof senha !== "string" || !senha) {
        return response.status(400).json({
          error: "Senha é obrigatória.",
        });
      }

      const emailNormalizado = email.trim().toLowerCase();

      const user = await prisma.user.findUnique({
        where: {
          email: emailNormalizado,
        },
      });

      if (!user) {
        return response.status(401).json({
          error: "Email ou senha inválidos",
        });
      }

      if (!user.ativo) {
        return response.status(401).json({
          error:
            "A sua conta foi desativada. Entre em contato com o administrador.",
        });
      }

      const senhaMatch = await compare(senha, user.senha);

      if (!senhaMatch) {
        return response.status(401).json({
          error: "Email ou senha inválidos",
        });
      }

      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error("JWT_SECRET não configurado.");
        return response.status(500).json({
          error: "Erro interno de configuração do servidor.",
        });
      }

      const token = jwt.sign(
        {
          cargo: user.cargo,
        },
        jwtSecret,
        {
          subject: user.id,
          expiresIn: "7d",
        }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: {
          ultimoLogin: new Date(),
        },
      });

      return response.status(200).json({
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          cargo: user.cargo,
          assinatura: user.assinatura,
        },
        token,
      });
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      return response.status(500).json({
        error: "Erro interno ao realizar login.",
      });
    }
  }
}