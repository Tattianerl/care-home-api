import { Request, Response } from "express";
import PDFDocument from "pdfkit";

import { prisma } from "../../lib/prisma";
import { formatDate } from "../../utils/formatDate";

export class ExportAuditPdfController {
  async handle(request: Request, response: Response) {
    try {
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
        'attachment; filename="carehome_auditoria.pdf"',
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
        .text("Relatório de Auditoria", {
          align: "center",
        });

      doc.moveDown(0.5);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#6B7280")
        .text(
          `Emitido em: ${new Date().toLocaleString(
            "pt-BR",
          )}`,
          {
            align: "center",
          },
        );

      doc.moveDown(1.5);

      // ------------------------------------------------------
      // RESUMO
      // ------------------------------------------------------

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#0F766E")
        .text(`Total de registros: ${logs.length}`);

      doc.moveDown(1);

      if (logs.length === 0) {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#6B7280")
          .text("Nenhum registro de auditoria encontrado.");

        doc.end();
        return;
      }

      // ------------------------------------------------------
      // REGISTROS DE AUDITORIA
      // ------------------------------------------------------

      logs.forEach((log, index) => {
        // Evita iniciar um registro no final da página.
        if (doc.y > 650) {
          doc.addPage();
        }

        // ----------------------------------------------------
        // IDENTIFICAÇÃO DO REGISTRO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#111827")
          .text(`Registro ${index + 1}`);

        doc.moveDown(0.3);

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
        // DATA
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Data:");

        doc
          .font("Helvetica")
          .text(formatDate(log.createdAt));

        doc.moveDown(0.4);

        // ----------------------------------------------------
        // USUÁRIO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Usuário responsável:");

        doc
          .font("Helvetica")
          .text(`Nome: ${log.user.nome}`)
          .text(`Cargo: ${log.user.cargo}`);

        doc.moveDown(0.4);

        // ----------------------------------------------------
        // AÇÃO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Ação:");

        doc
          .font("Helvetica")
          .text(log.acao);

        doc.moveDown(0.4);

        // ----------------------------------------------------
        // ENTIDADE
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Entidade:");

        doc
          .font("Helvetica")
          .text(log.entidade);

        doc.moveDown(0.4);

        // ----------------------------------------------------
        // IDENTIFICADOR DA ENTIDADE
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Identificador:");

        doc
          .font("Helvetica")
          .text(log.entidadeId);

        doc.moveDown(0.4);

        // ----------------------------------------------------
        // DESCRIÇÃO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Descrição:");

        doc
          .font("Helvetica")
          .text(log.descricao ?? "Sem descrição.", {
            align: "justify",
            lineGap: 2,
          });

        doc.moveDown(0.9);

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
      // RODAPÉ EM TODAS AS PÁGINAS
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
        "[ExportAuditPdfController] Erro ao gerar PDF:",
        error,
      );

      if (!response.headersSent) {
        return response.status(500).json({
          error:
            "Falha ao gerar relatório de auditoria em PDF.",
        });
      }

      response.end();
    }
  }
}