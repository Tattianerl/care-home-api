import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; 

export class ListUsersController {
  async handle(request: Request, response: Response) {
    try {
     
      const users = await prisma.user.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
        },
        orderBy: {
          nome: "asc", 
        }
      });

      return response.status(200).json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return response.status(500).json({ error: "Erro interno do servidor ao buscar funcionários." });
    }
  }
}