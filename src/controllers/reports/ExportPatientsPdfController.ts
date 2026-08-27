import { Request, Response } from "express";
import PDFDocument from "pdfkit";

import { prisma } from "../../lib/prisma";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportPatientsPdfController {
  async handle(request: Request, response: Response) {
    try {
      const patients = await prisma.patient.findMany({
        where: {
          ativo: true,
        },
        orderBy: {
          nome: "asc",
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
        'attachment; filename="carehome_residentes.pdf"',
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
        .text("Relatório de Residentes", {
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

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#0F766E")
        .text(`Total de residentes ativos: ${patients.length}`);

      doc.moveDown(1);

      if (patients.length === 0) {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#6B7280")
          .text("Nenhum residente ativo encontrado.");

        doc.end();
        return;
      }

      // ------------------------------------------------------
      // RESIDENTES
      // ------------------------------------------------------

      patients.forEach((patient, index) => {
        // Verifica espaço disponível antes de iniciar um novo residente.
        if (doc.y > 680) {
          doc.addPage();
        }

        // Cabeçalho do residente
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#111827")
          .text(`${index + 1}. ${patient.nome}`);

        doc.moveDown(0.4);

        // Linha de identificação
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

        doc.text(
          `Responsável: ${formatValue(patient.responsavel)}`,
        );

        doc.text(
          `Telefone: ${formatValue(patient.telefone)}`,
        );

        doc.text(
          `Data de nascimento: ${formatDate(
            patient.dataNascimento,
            false,
          )}`,
        );

        doc.moveDown(0.3);

        doc
          .font("Helvetica-Bold")
          .text("Informações clínicas");

        doc.font("Helvetica");

        doc.text(
          `Histórico médico: ${formatValue(
            patient.historicoMedico,
          )}`,
        );

        doc.text(
          `Alergias: ${formatValue(patient.alergias)}`,
        );

        doc.text(
          `Diagnósticos: ${formatValue(
            patient.diagnosticos,
          )}`,
        );

        doc.moveDown(0.8);

        // Linha divisória entre residentes
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
        "[ExportPatientsPdfController] Erro ao gerar PDF:",
        error,
      );

      if (!response.headersSent) {
        return response.status(500).json({
          error: "Falha ao gerar relatório de residentes em PDF.",
        });
      }

      response.end();
    }
  }
}