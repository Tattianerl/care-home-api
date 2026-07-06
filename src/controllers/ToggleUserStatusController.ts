import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ToggleUserStatusController {
  async handle(request: Request, response: Response) {
    try {
      // 1. Garante que o middleware injetou o usuário antes de acessar as propriedades
      if (!request.user) {
        return response.status(401).json({ error: "Não autorizado." });
      }

      const id  = request.params.id as string; // ID do funcionário a ser alterado
      const adminId = request.user.id; // ID do administrador logado

      // Impede que o admin se desative por acidente
      if (id === adminId) {
        return response.status(400).json({ error: "Não pode desativar a sua própria conta." });
      }

      // 2. Busca o usuário atual no banco
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado." });
      }

      // 3. Inverte o status atual usando o campo correto do seu schema: 'ativo' 
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { ativo: !user.ativo }, 
        select: {
          id: true,
          nome: true,
          ativo: true,
        },
      });

      const mensagem = updatedUser.ativo 
        ? `Usuário ${updatedUser.nome} reativado com sucesso.` 
        : `Valeu! Usuário ${updatedUser.nome} desativado com sucesso.`;

      return response.status(200).json({ message: mensagem, user: updatedUser });
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
      return response.status(500).json({ error: "Erro interno ao alterar status do funcionário." });
    }
  }
}