import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import axios from "axios";

import { prisma } from "../../lib/prisma";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

async function fetchImageBuffer(
  url: string,
): Promise<Buffer | null> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error(
      "[ExportEvolutionsPdfController] Erro ao carregar assinatura:",
      error,
    );

    return null;
  }
}

export class ExportEvolutionsPdfController {
  async handle(
    request: Request,
    response: Response,
  ) {
    try {
      const { patientId } = request.query;

      const whereCondition = patientId
        ? {
            patientId: String(patientId),
          }
        : {};

      const evolutions =
        await prisma.evolution.findMany({
          where: whereCondition,

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
                assinatura: true,
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

      const filename = patientId
        ? `carehome_evolucoes_${String(patientId)}.pdf`
        : "carehome_evolucoes.pdf";

      response.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
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
        .text("Relatório de Evoluções", {
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
        .text(
          `Total de evoluções: ${evolutions.length}`,
        );

      doc.moveDown(1);

      if (evolutions.length === 0) {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#6B7280")
          .text("Nenhuma evolução registrada.");

        doc.end();
        return;
      }

      // ------------------------------------------------------
      // EVOLUÇÕES
      // ------------------------------------------------------

      for (
        let index = 0;
        index < evolutions.length;
        index += 1
      ) {
        const evolution = evolutions[index];

        // Evita iniciar uma evolução no final da página.
        if (doc.y > 650) {
          doc.addPage();
        }

        // ----------------------------------------------------
        // IDENTIFICAÇÃO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#111827")
          .text(
            `${index + 1}. Evolução`,
          );

        doc.moveDown(0.3);

        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#0F766E")
          .text(
            `Paciente: ${evolution.patient.nome}`,
          );

        doc.moveDown(0.5);

        doc
          .strokeColor("#D1D5DB")
          .lineWidth(0.7)
          .moveTo(45, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        doc.moveDown(0.6);

        // ----------------------------------------------------
        // DATA
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor("#374151")
          .text("Data e horário:");

        doc
          .font("Helvetica")
          .text(
            formatDate(evolution.createdAt),
          );

        doc.moveDown(0.4);

        // ----------------------------------------------------
        // PROFISSIONAL
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Profissional responsável:");

        doc
          .font("Helvetica")
          .text(
            `Nome: ${formatValue(
              evolution.user.nome,
            )}`,
          );

        doc.text(
          `Cargo: ${formatValue(
            evolution.user.cargo,
          )}`,
        );

        doc.moveDown(0.5);

        // ----------------------------------------------------
        // DESCRIÇÃO DA EVOLUÇÃO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Evolução clínica:");

        doc
          .font("Helvetica")
          .text(
            formatValue(evolution.descricao),
            {
              align: "justify",
              lineGap: 2,
            },
          );

        doc.moveDown(0.7);

        // ----------------------------------------------------
        // ASSINATURA
        // ----------------------------------------------------

        const assinatura =
          evolution.assinatura ||
          evolution.user.assinatura;

        doc
          .font("Helvetica-Bold")
          .text("Assinatura profissional:");

        if (assinatura) {
          const imageBuffer =
            await fetchImageBuffer(assinatura);

          if (imageBuffer) {
            doc.moveDown(0.3);

            doc.image(imageBuffer, {
              fit: [140, 45],
            });

            doc.moveDown(0.3);

            doc
              .font("Helvetica")
              .fontSize(8)
              .fillColor("#6B7280")
              .text(
                "Assinatura digital registrada no sistema.",
              );
          } else {
            doc
              .font("Helvetica")
              .fontSize(8)
              .fillColor("#6B7280")
              .text(
                "Assinatura registrada, porém não foi possível carregar a imagem.",
              );
          }
        } else {
          doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor("#6B7280")
            .text(
              "Não há assinatura digital cadastrada para este registro.",
            );
        }

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
      }

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
        "[ExportEvolutionsPdfController] Erro ao gerar PDF:",
        error,
      );

      if (!response.headersSent) {
        return response.status(500).json({
          error:
            "Falha ao gerar relatório de evoluções em PDF.",
        });
      }

      response.end();
    }
  }
}