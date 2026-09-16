import { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";

export class ExportAuditLogsController {
  async handle(request: Request, response: Response) {
    try {
      const logs = await prisma.auditLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              cargo: true,
            },
          },
        },
      });

      const csvData = logs.map((log) => ({
        Data: formatDate(log.createdAt),
        UsuarioId: log.user.id,
        Usuario: log.user.nome,
        Cargo: log.user.cargo,
        Acao: log.acao,
        Entidade: log.entidade,
        EntidadeId: log.entidadeId,
        IP: log.ip ?? "",
        Descricao: log.descricao ?? "",
      }));

      return exportCsv(
        response,
        csvData,
        "carehome_auditoria.csv"
      );
    } catch (error) {
      console.error(
        "Erro ao exportar logs de auditoria:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao exportar logs de auditoria.",
      });
    }
  }
}