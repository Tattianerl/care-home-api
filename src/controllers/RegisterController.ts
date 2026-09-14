import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

export class RegisterController {
  async handle(request: Request, response: Response) {
    try {
      const {
        nome,
        email,
        senha,
        cargo,
        cpf,
        telefone,
        registroProfissional,
      } = request.body;

      const requestUserId = request.user?.id;

      if (!requestUserId) {
        return response.status(401).json({
          error: "Usuário não autenticado.",
        });
      }

      const adminUser = await prisma.user.findUnique({
        where: {
          id: requestUserId,
        },
        select: {
          id: true,
          cargo: true,
        },
      });

      if (!adminUser || adminUser.cargo !== UserRole.ADMIN) {
        return response.status(403).json({
          error:
            "Apenas administradores podem cadastrar funcionários.",
        });
      }

      // Nome é obrigatório no schema
      if (
        typeof nome !== "string" ||
        !nome.trim()
      ) {
        return response.status(400).json({
          error: "Nome é obrigatório.",
        });
      }

      // E-mail é obrigatório e único no schema
      if (
        typeof email !== "string" ||
        !email.trim()
      ) {
        return response.status(400).json({
          error: "E-mail é obrigatório.",
        });
      }

      // Senha é obrigatória no schema
      if (
        typeof senha !== "string" ||
        !senha.trim()
      ) {
        return response.status(400).json({
          error: "Senha é obrigatória.",
        });
      }

      if (senha.length < 8) {
        return response.status(400).json({
          error: "A senha deve ter pelo menos 8 caracteres.",
        });
      }

      // Cargo é obrigatório e deve pertencer ao enum UserRole
      if (
        typeof cargo !== "string" ||
        !Object.values(UserRole).includes(
          cargo as UserRole
        )
      ) {
        return response.status(400).json({
          error: "Cargo inválido.",
        });
      }

      // CPF é obrigatório e único no schema
      if (
        typeof cpf !== "string" ||
        !cpf.trim()
      ) {
        return response.status(400).json({
          error: "CPF é obrigatório.",
        });
      }

      const cpfLimpo = cpf.replace(/\D/g, "");

      if (cpfLimpo.length !== 11) {
        return response.status(400).json({
          error: "CPF inválido. Informe um CPF com 11 dígitos.",
        });
      }

      const nomeNormalizado = nome.trim();
      const emailNormalizado = email.trim().toLowerCase();
      const cargoNormalizado = cargo.trim().toUpperCase() as UserRole;

      const emailExists = await prisma.user.findUnique({
        where: {
          email: emailNormalizado,
        },
        select: {
          id: true,
        },
      });

      if (emailExists) {
        return response.status(409).json({
          error: "E-mail já cadastrado.",
        });
      }

      const cpfExists = await prisma.user.findUnique({
        where: {
          cpf: cpfLimpo,
        },
        select: {
          id: true,
        },
      });

      if (cpfExists) {
        return response.status(409).json({
          error: "CPF já cadastrado.",
        });
      }

      const senhaHash = await hash(senha, 10);

      const user = await prisma.user.create({
        data: {
          nome: nomeNormalizado,
          email: emailNormalizado,
          cpf: cpfLimpo,
          senha: senhaHash,
          cargo: cargoNormalizado,

          telefone:
            typeof telefone === "string" &&
            telefone.trim()
              ? telefone.trim()
              : undefined,

          registroProfissional:
            typeof registroProfissional === "string" &&
            registroProfissional.trim()
              ? registroProfissional.trim()
              : undefined,
        },

        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          telefone: true,
          cargo: true,
          registroProfissional: true,
          ativo: true,
          createdAt: true,
        },
      });

      await createAuditLog({
        userId: requestUserId,
        acao: AuditActions.CREATE,
        entidade: "USER",
        entidadeId: user.id,
        descricao:
          `Funcionário "${user.nome}" ` +
          `cadastrado com o cargo "${user.cargo}".`,
      });

      return response.status(201).json(user);
    } catch (error) {
      console.error(
        "Erro ao cadastrar funcionário:",
        error
      );

      // Proteção adicional caso dois cadastros
      // concorrentes atinjam uma constraint UNIQUE.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return response.status(409).json({
          error:
            "Já existe um funcionário com um dos dados informados.",
        });
      }

      return response.status(500).json({
        error: "Erro ao cadastrar funcionário.",
      });
    }
  }
}