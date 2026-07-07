import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";

export class RegisterController {
  async handle(request: Request, response: Response) {
    // 1. Captura o novo campo CPF vindo do corpo da requisição
    const { nome, email, senha, cargo, cpf } = request.body;

    try {
      // 2. TRAVA DE SEGURANÇA: Verifica se quem está tentando cadastrar é um ADMIN
      // O 'request.user.id' geralmente é injetado pelo seu middleware de autenticação JWT
      const requestUserId = request.user?.id; 

      if (!requestUserId) {
        return response.status(401).json({ error: "Não autorizado. Token ausente ou inválido." });
      }

      const adminUser = await prisma.user.findUnique({
        where: { id: requestUserId }
      });

      if (!adminUser || adminUser.cargo !== "admin") {
        return response.status(403).json({ 
          error: "Acesso negado. Apenas administradores podem cadastrar novos funcionários." 
        });
      }

      // 3. VALIDAÇÃO: Verifica se o e-mail já está cadastrado
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return response.status(400).json({
          error: "Este e-mail já está em uso por outro funcionário.",
        });
      }

      // 4. VALIDAÇÃO: Verifica se o CPF já está cadastrado
      // Limpa pontos e traços caso venham do frontend (ex: "123.456.789-00" vira "12345678900")
      const cpfLimpo = cpf.replace(/\D/g, "");

      const cpfExists = await prisma.user.findUnique({
        where: { cpf: cpfLimpo },
      });

      if (cpfExists) {
        return response.status(400).json({
          error: "Este CPF já está cadastrado no sistema.",
        });
      }

      // 5. Criptografia da senha
      const senhaHash = await hash(senha, 8);

      // 6. Gravação segura no banco com o novo campo CPF
      const user = await prisma.user.create({
        data: {
          nome,
          email,
          cpf: cpfLimpo,
          senha: senhaHash,
          cargo,
        },
        // Opcional: Omitir a senha do retorno por segurança visual na resposta
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          cargo: true,
          ativo: true,
          createdAt: true
        }
      });

      return response.status(201).json(user);

    } catch (error) {
      console.error("Erro no cadastro de funcionário:", error);
      return response.status(500).json({ error: "Erro interno do servidor ao processar o cadastro." });
    }
  }
}