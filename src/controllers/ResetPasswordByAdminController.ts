import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma"; 

export class ResetPasswordByAdminController {
  async handle(request: Request, response: Response) {
    
    const { funcionarioId, novaSenhaProvisoria } = request.body;
    
    // O seu authMiddleware precisa ter injetado o usuário logado em request.user
    const adminCargo = (request as any).user?.cargo; 

    // 2. Bloqueio de segurança: Apenas administradores podem usar esta rota
    if (adminCargo !== "admin") {
      return response.status(403).json({ 
        error: "Acesso negado. Apenas administradores podem resetar senhas." 
      });
    }

    // 3. Validações básicas de campos
    if (!funcionarioId || !novaSenhaProvisoria) {
      return response.status(400).json({ 
        error: "O ID do funcionário e a nova senha são obrigatórios." 
      });
    }

    if (novaSenhaProvisoria.length < 6) {
      return response.status(400).json({
        error: "A senha provisória deve conter no mínimo 6 caracteres."
      });
    }

    try {
      // 4. Verifica se o funcionário realmente existe no banco de dados
      const funcionarioExists = await prisma.user.findUnique({
        where: { id: funcionarioId }
      });

      if (!funcionarioExists) {
        return response.status(404).json({ error: "Funcionário não encontrado." });
      }

      // 5. Criptografa a nova senha provisória de forma segura
      const senhaHash = await hash(novaSenhaProvisoria, 8);

      // 6. Atualiza a senha dele no banco do Supabase via Prisma
      await prisma.user.update({
        where: { id: funcionarioId },
        data: { senha: senhaHash },
      });

      return response.status(200).json({ 
        message: `A senha de ${funcionarioExists.nome} foi redefinida com sucesso!` 
      });

    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      return response.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}