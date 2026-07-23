import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class GetLatestVitalSignController {
  async handle(request: Request<{ id: string }>, response: Response) {
    const patientId = request.params.id;

    const latestVitalSign = await prisma.vitalSign.findFirst({
      where: { 
        patientId 
      },
      orderBy: { 
        createdAt: "desc" 
      },
      include: {
        user: { 
          select: { 
            nome: true, 
            cargo: true 
          } 
        },
      },
    });

    if (!latestVitalSign) {
      return response.status(404).json({ error: "Nenhum sinal vital registrado." });
    }

    return response.json(latestVitalSign);
  }
}