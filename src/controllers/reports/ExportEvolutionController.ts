import { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";

export class ExportEvolutionController {
  async handle(request: Request, response: Response) {
    try {
      const evolutions = await prisma.evolution.findMany({
        include: {
          patient: {
            select: {
              id: true,
              nome: true,
            },
          },
          user: {
            select: {
              id: true,
              nome: true,
              cargo: true,
              registroProfissional: true,
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
        RegistroProfissional:
          evolution.user.registroProfissional ?? "",
        Data: formatDate(evolution.createdAt),
        Descricao: evolution.descricao,
      }));

      return exportCsv(
        response,
        csvData,
        "carehome_evolucoes.csv"
      );
    } catch (error) {
      console.error(
        "Erro ao exportar evoluções:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao exportar evoluções.",
      });
    }
  }
}