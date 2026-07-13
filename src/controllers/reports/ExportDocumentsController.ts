import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportDocumentsController {
  async handle(request: Request, response: Response) {
    const documents = await prisma.patientDocument.findMany({
      include: {
        patient: {
          select: {
            nome: true,
          },
        },
        deletedByUser: {
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

    const csvData = documents.map((document) => ({
      Paciente: document.patient.nome,
      Documento: document.nome,
      Arquivo: document.arquivo,
      DataUpload: formatDate(document.createdAt),
      Status: document.deletedAt ? "Excluído" : "Ativo",

      ExcluidoPor: formatValue(
        document.deletedByUser?.nome ?? document.deletedBy
      ),

      CargoExclusao:
        document.deletedByUser?.cargo ?? "",

      DataExclusao: document.deletedAt
        ? formatDate(document.deletedAt)
        : "",
    }));

    return exportCsv(
      response,
      csvData,
      "carehome_documentos.csv"
    );
  }
}