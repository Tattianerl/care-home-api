import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";

export class ExportEvolutionController {
  async handle(request: Request, response: Response) {
    const evolutions = await prisma.evolution.findMany({
      include: {
        patient: {
          select: {
            nome: true,
          },
        },
        user: {
          select: {
            nome: true,
            cargo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

   const csvData = evolutions.map((evolution) => ({
      Paciente: evolution.patient.nome,
      Profissional: evolution.user.nome,
      Cargo: evolution.user.cargo,
      Data: formatDate(evolution.createdAt),
      Descricao: evolution.descricao,
      Assinatura: evolution.assinatura ? "Sim" : "Não",
    }));

    return exportCsv(
      response,
      csvData,
      "carehome_evolucoes.csv"
    );
  }
}