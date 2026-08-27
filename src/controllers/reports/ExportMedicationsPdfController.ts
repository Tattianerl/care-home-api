import { Request, Response } from "express";
import PDFDocument from "pdfkit";

import { prisma } from "../../lib/prisma";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportMedicationsPdfController {
  async handle(request: Request, response: Response) {
    try {
      const medications = await prisma.medication.findMany({
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
            },
          },
          prescritoPor: {
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
        'attachment; filename="carehome_medicamentos.pdf"',
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
        .text("Relatório de Medicamentos", {
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
        .text(
          `Total de registros de medicamentos: ${medications.length}`,
        );

      doc.moveDown(1);

      if (medications.length === 0) {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#6B7280")
          .text("Nenhum medicamento cadastrado.");

        doc.end();
        return;
      }

      // ------------------------------------------------------
      // MEDICAMENTOS
      // ------------------------------------------------------

      medications.forEach((medication, index) => {
        if (doc.y > 650) {
          doc.addPage();
        }

        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#111827")
          .text(
            `${index + 1}. ${medication.nome}`,
          );

        doc.moveDown(0.3);

        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#0F766E")
          .text(
            `Paciente: ${medication.patient.nome}`,
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
        // PRESCRIÇÃO
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Dados da prescrição");

        doc.font("Helvetica");

        doc.text(
          `Dosagem: ${formatValue(medication.dosagem)}`,
        );

        doc.text(
          `Frequência: ${formatValue(
            medication.frequencia,
          )}`,
        );

        doc.text(
          `Via de administração: ${formatValue(
            medication.viaAdministracao,
          )}`,
        );

        doc.text(
          `Status: ${formatValue(
            medication.status,
          )}`,
        );

        doc.text(
          `Uso contínuo: ${
            medication.usoContinuo ? "Sim" : "Não"
          }`,
        );

        doc.text(
          `Controlado: ${
            medication.controlado ? "Sim" : "Não"
          }`,
        );

        doc.moveDown(0.5);

        // ----------------------------------------------------
        // HORÁRIOS
        // ----------------------------------------------------

        if (
          Array.isArray(medication.horarios) &&
          medication.horarios.length > 0
        ) {
          doc
            .font("Helvetica-Bold")
            .text("Horários:");

          doc
            .font("Helvetica")
            .text(
              medication.horarios.join(" • "),
            );

          doc.moveDown(0.5);
        }

        // ----------------------------------------------------
        // PERÍODO DO TRATAMENTO
        // ----------------------------------------------------

        if (
          medication.inicioTratamento ||
          medication.fimTratamento
        ) {
          doc
            .font("Helvetica-Bold")
            .text("Período do tratamento:");

          doc.font("Helvetica");

          doc.text(
            `Início: ${
              medication.inicioTratamento
                ? formatDate(
                    medication.inicioTratamento,
                    false,
                  )
                : "-"
            }`,
          );

          doc.text(
            `Fim: ${
              medication.fimTratamento
                ? formatDate(
                    medication.fimTratamento,
                    false,
                  )
                : "-"
            }`,
          );

          doc.moveDown(0.5);
        }

        // ----------------------------------------------------
        // OBSERVAÇÕES
        // ----------------------------------------------------

        if (medication.observacoes) {
          doc
            .font("Helvetica-Bold")
            .text("Observações:");

          doc
            .font("Helvetica")
            .text(
              formatValue(medication.observacoes),
            );

          doc.moveDown(0.5);
        }

        // ----------------------------------------------------
        // PROFISSIONAIS
        // ----------------------------------------------------

        doc
          .font("Helvetica-Bold")
          .text("Responsabilidade profissional:");

        doc.font("Helvetica");

        doc.text(
          `Prescrito por: ${
            medication.prescritoPor?.nome ?? "-"
          }`,
        );

        if (medication.prescritoPor?.cargo) {
          doc.text(
            `Cargo do prescritor: ${medication.prescritoPor.cargo}`,
          );
        }

        doc.text(
          `Lançado por: ${medication.user.nome}`,
        );

        doc.text(
          `Cargo: ${medication.user.cargo}`,
        );

        doc.text(
          `Data do registro: ${formatDate(
            medication.createdAt,
          )}`,
        );

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
        "[ExportMedicationsPdfController] Erro ao gerar PDF:",
        error,
      );

      if (!response.headersSent) {
        return response.status(500).json({
          error:
            "Falha ao gerar relatório de medicamentos em PDF.",
        });
      }

      response.end();
    }
  }
}