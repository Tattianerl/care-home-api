import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";

export class ExportAuditLogsController {
  async handle(request: Request, response: Response) {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            nome: true,
            cargo: true,
          },
        },
      },
    });

    const csvData = logs.map((log) => ({
      Data: formatDate(log.createdAt),
      Usuario: log.user.nome,
      Cargo: log.user.cargo,
      Acao: log.acao,
      Entidade: log.entidade,
      Descricao: log.descricao ?? "",
    }));

    return exportCsv(
      response,
      csvData,
      "carehome_auditoria.csv"
    );
  }
}