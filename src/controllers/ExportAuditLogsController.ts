import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

    const csvRows = [
      [
        "Data",
        "Usuario",
        "Cargo",
        "Acao",
        "Entidade",
        "Descricao",
      ].join(","),
    ];

    logs.forEach((log) => {
      csvRows.push([
        `"${new Date(log.createdAt).toLocaleString("pt-BR")}"`,
        `"${log.user.nome}"`,
        `"${log.user.cargo}"`,
        `"${log.acao}"`,
        `"${log.entidade}"`,
        `"${log.descricao ?? ""}"`,
      ].join(","));
    });

    const csv = csvRows.join("\n");

    response.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    response.setHeader(
      "Content-Disposition",
      'attachment; filename="audit_logs.csv"'
    );

    return response.status(200).send(csv);
  }
}