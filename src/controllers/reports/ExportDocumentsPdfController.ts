import { Request, Response } from "express";
import PDFDocument from "pdfkit";

import { prisma } from "../../lib/prisma";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportDocumentsPdfController {
  async handle(request: Request, response: Response) {
    try {
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
        orderBy: [
          {
            patient: {
              nome: "asc",
            },
          },
          {
            createdAt: "desc",
          },
        ],
      });

      const doc = new PDFDocument({
        margin: 45,
        size: "A4",
        bufferPages: true,
      });

      response.setHeader(
        "Content-Type",
        "application/pdf",
      );

      response.setHeader(
        "Content-Disposition",
        'attachment; filename="carehome_documentos.pdf"',
      );

      doc.pipe(response);

      // ------------------------------------------------------
      // CABEÇALHO
      // ------------------------------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor("#0F766E")
        .text("CARE HOME", {
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor("#111827")
        .text("Relatório de Documentos", {
          align: "center",
        });

      doc.moveDown(0.5);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#6B7280")
        .text(
          `Emitido em: ${new Date().toLocaleString("pt-BR")}`,
          {
            align: "center",
          },
        );

      doc.moveDown(1.5);

      // ------------------------------------------------------
      // RESUMO
      // ------------------------------------------------------

      const totalDocuments = documents.length;
      const activeDocuments = documents.filter(
        (document) => !document.deletedAt,
      ).length;
      const deletedDocuments = documents.filter(
        (document) => Boolean(document.deletedAt),
      ).length;

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#0F766E")
        .text(`Total de documentos: ${totalDocuments}`);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#374151")
        .text(`Documentos ativos: ${activeDocuments}`)
        .text(`Documentos excluídos: ${deletedDocuments}`);

      doc.moveDown(1);

      if (documents.length === 0) {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#6B7280")
          .text("Nenhum documento encontrado.");

        doc.end();
        return;
      }

      // ------------------------------------------------------
      // DOCUMENTOS
      // ------------------------------------------------------

      documents.forEach((document, index) => {
        if (doc.y > 650) {
          doc.addPage();
        }

        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#111827")
          .text(
            `${index + 1}. ${document.nome}`,
          );

        doc.moveDown(0.3);

        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#0F766E")
          .text(
            `Paciente: ${document.patient.nome}`,
          );

        doc.moveDown(0.5);

        doc
          .strokeColor("#D1D5DB")
          .lineWidth(0.7)
          .moveTo(45, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        doc.moveDown(0.6);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#374151");

        // ----------------------------------------------------
        // DADOS DO DOCUMENTO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Dados do documento");

        doc.font("Helvetica");

        doc.text(
          `Nome: ${formatValue(document.nome)}`,
        );

        doc.text(
          `Tipo: ${formatValue(document.tipo)}`,
        );

        doc.text(
          `Arquivo: ${formatValue(document.arquivo)}`,
        );

        doc.text(
          `Data de upload: ${formatDate(
            document.createdAt,
          )}`,
        );

        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        doc.moveDown(0.5);

        doc
          .font("Helvetica-Bold")
          .text("Status:");

        if (document.deletedAt) {
          doc
            .font("Helvetica-Bold")
            .fillColor("#B91C1C")
            .text("Excluído");

          doc
            .font("Helvetica")
            .fillColor("#374151");

          doc.text(
            `Data de exclusão: ${formatDate(
              document.deletedAt,
            )}`,
          );

          doc.text(
            `Excluído por: ${
              document.deletedByUser?.nome ??
              formatValue(document.deletedBy)
            }`,
          );

          if (document.deletedByUser?.cargo) {
            doc.text(
              `Cargo: ${document.deletedByUser.cargo}`,
            );
          }
        } else {
          doc
            .font("Helvetica-Bold")
            .fillColor("#047857")
            .text("Ativo");

          doc
            .font("Helvetica")
            .fillColor("#374151");
        }

        doc.moveDown(0.8);

        // ----------------------------------------------------
        // DIVISÓRIA
        // ----------------------------------------------------

        doc
          .strokeColor("#E5E7EB")
          .lineWidth(0.5)
          .moveTo(45, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        doc.moveDown(0.9);
      });

      // ------------------------------------------------------
      // RODAPÉ
      // ------------------------------------------------------

      const range = doc.bufferedPageRange();

      for (
        let pageIndex = range.start;
        pageIndex < range.start + range.count;
        pageIndex += 1
      ) {
        doc.switchToPage(pageIndex);

        doc
          .strokeColor("#D1D5DB")
          .lineWidth(0.5)
          .moveTo(45, 770)
          .lineTo(550, 770)
          .stroke();

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#6B7280")
          .text(
            "Care Home - Sistema de Gestão para Casa de Repouso",
            45,
            778,
            {
              width: 505,
              align: "center",
            },
          );

        doc.text(
          `Página ${pageIndex + 1} de ${range.count}`,
          45,
          790,
          {
            width: 505,
            align: "center",
          },
        );
      }

      doc.end();
    } catch (error) {
      console.error(
        "[ExportDocumentsPdfController] Erro ao gerar PDF:",
        error,
      );

      if (!response.headersSent) {
        return response.status(500).json({
          error:
            "Falha ao gerar relatório de documentos em PDF.",
        });
      }

      response.end();
    }
  }
}