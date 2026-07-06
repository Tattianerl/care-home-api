import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { compare, hash } from "bcryptjs"; 
export class UpdatePasswordController {
  async handle(request: Request, response: Response) {
    try {
      const userId = request.user.id; 
      const { senhaAntiga, novaSenha } = request.body;

      if (!senhaAntiga || !novaSenha) {
        return response.status(400).json({ error: "Campos obrigatórios ausentes." });
      }

      if (novaSenha.length < 6) {
        return response.status(400).json({ error: "A nova senha deve ter pelo menos 6 caracteres." });
      }

      // 1. Busca o usuário no banco para pegar a senha criptografada atual
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado." });
      }

      // 2. Verifica se a senha antiga informada está correta
      const senhaIncorreta = await compare(senhaAntiga, user.senha);
      if (!senhaIncorreta) {
        return response.status(400).json({ error: "A senha antiga está incorreta." });
      }

      // 3. Criptografa a nova senha e atualiza no banco
      const novaSenhaCriptografada = await hash(novaSenha, 8);

      await prisma.user.update({
        where: { id: userId },
        data: { senha: novaSenhaCriptografada },
      });

      return response.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      return response.status(500).json({ error: "Erro interno ao atualizar senha." });
    }
  }
}