import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { UserRole } from "@prisma/client";

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
      });

      if (!adminUser || adminUser.cargo !== UserRole.ADMIN) {
        return response.status(403).json({
          error:
            "Apenas administradores podem cadastrar funcionários.",
        });
      }

      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists) {
        return response.status(400).json({
          error: "E-mail já cadastrado.",
        });
      }

      const cpfLimpo = cpf.replace(/\D/g, "");

      const cpfExists = await prisma.user.findUnique({
        where: {
          cpf: cpfLimpo,
        },
      });

      if (cpfExists) {
        return response.status(400).json({
          error: "CPF já cadastrado.",
        });
      }

      const senhaHash = await hash(senha, 10);

      const user = await prisma.user.create({
        data: {
          nome,
          email,
          cpf: cpfLimpo,
          telefone,
          senha: senhaHash,
          cargo,
          registroProfissional,
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
        descricao: `Funcionário ${user.nome} cadastrado.`,
      });

      return response.status(201).json(user);
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        error: "Erro ao cadastrar funcionário.",
      });
    }
  }
}