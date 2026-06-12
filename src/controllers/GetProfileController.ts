import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetProfileController {
  async handle(request: Request, response: Response) {

    const userId = request.user?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        assinatura: true,
        createdAt: true,
      },
    });

    return response.json(user);
  }
}