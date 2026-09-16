import { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportDocumentsController {
  async handle(request: Request, response: Response) {
    try {
      const documents = await prisma.patientDocument.findMany({
        include: {
          patient: {
            select: {
              id: true,
              nome: true,
            },
          },
          deletedByUser: {
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

      const csvData = documents.map((document) => ({
        Paciente: document.patient.nome,

        Documento: document.nome,

        Tipo: document.tipo,

        Arquivo: document.arquivo,

        DataUpload: formatDate(document.createdAt),

        Status: document.deletedAt
          ? "Excluído"
          : "Ativo",

        ExcluidoPor: formatValue(
          document.deletedByUser?.nome ??
            document.deletedBy
        ),

        CargoExclusao:
          document.deletedByUser?.cargo ?? "",

        RegistroProfissionalExclusao:
          document.deletedByUser?.registroProfissional ?? "",

        DataExclusao: document.deletedAt
          ? formatDate(document.deletedAt)
          : "",
      }));

      return exportCsv(
        response,
        csvData,
        "carehome_documentos.csv"
      );
    } catch (error) {
      console.error(
        "Erro ao exportar documentos:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao exportar documentos.",
      });
    }
  }
}