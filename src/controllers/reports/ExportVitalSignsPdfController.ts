import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import PDFDocument from "pdfkit-table";

export class ExportVitalSignsPdfController {
  async handle(request: Request, response: Response) {
    try {
      const patientId =
        typeof request.query.patientId === "string"
          ? request.query.patientId.trim()
          : undefined;

      const whereCondition = patientId
        ? { patientId }
        : {};

      const vitals = await prisma.vitalSign.findMany({
        where: whereCondition,

        select: {
          id: true,
          createdAt: true,
          pressaoSistolica: true,
          pressaoDiastolica: true,
          temperatura: true,
          frequenciaCardiaca: true,
          frequenciaRespiratoria: true,
          saturacao: true,
          glicemia: true,
          peso: true,
          altura: true,
          imc: true,
          dor: true,
          observacoes: true,

          patient: {
            select: {
              id: true,
              nome: true,
            },
          },

          user: {
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

      const doc = new PDFDocument({
        margin: 40,
        size: "A4",
      });

      response.setHeader("Content-Type", "application/pdf");
      response.setHeader(
        "Content-Disposition",
        'attachment; filename="sinais_vitais.pdf"'
      );

      doc.pipe(response);

      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Care Home");

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Relatório de Sinais Vitais");

      if (patientId && vitals.length > 0) {
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Paciente: ${vitals[0].patient.nome}`);
      }

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(`Total de registros: ${vitals.length}`);

      doc.moveDown(1);

      const tableData = {
        title: "Registros de Sinais Vitais",

        headers: [
          "Data",
          "Paciente",
          "P.A.",
          "Temp.",
          "Glic.",
          "FC",
          "Sat.",
          "Resp.",
          "Profissional",
        ],

        rows: vitals.map((vital) => {
          const profissional = vital.user.registroProfissional
            ? `${vital.user.nome} (${vital.user.registroProfissional})`
            : vital.user.nome;

          return [
            new Date(vital.createdAt).toLocaleDateString("pt-BR"),

            vital.patient.nome,

            `${vital.pressaoSistolica}/${vital.pressaoDiastolica}`,

            `${vital.temperatura} °C`,

            vital.glicemia !== null
              ? `${vital.glicemia} mg/dL`
              : "-",

            vital.frequenciaCardiaca !== null
              ? `${vital.frequenciaCardiaca} bpm`
              : "-",

            vital.saturacao !== null
              ? `${vital.saturacao}%`
              : "-",

            vital.frequenciaRespiratoria !== null
              ? `${vital.frequenciaRespiratoria} irpm`
              : "-",

            profissional,
          ];
        }),
      };

      if (vitals.length === 0) {
        doc
          .fontSize(10)
          .font("Helvetica")
          .text("Nenhum registro de sinais vitais encontrado.");
      } else {
        await doc.table(tableData, {
          prepareHeader: () =>
            doc
              .font("Helvetica-Bold")
              .fontSize(7),

          prepareRow: () =>
            doc
              .font("Helvetica")
              .fontSize(7),

          padding: 4,
          columnSpacing: 3,
        });

        doc.moveDown(1);

        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .text("Informações complementares");

        doc.moveDown(0.5);

        vitals.forEach((vital, index) => {
          const detalhes = [
            `Registro ${index + 1} — ${new Date(
              vital.createdAt
            ).toLocaleString("pt-BR")}`,

            `Paciente: ${vital.patient.nome}`,

            vital.peso !== null
              ? `Peso: ${vital.peso} kg`
              : "Peso: -",

            vital.altura !== null
              ? `Altura: ${vital.altura} m`
              : "Altura: -",

            vital.imc !== null
              ? `IMC: ${vital.imc}`
              : "IMC: -",

            vital.dor !== null
              ? `Dor: ${vital.dor}`
              : "Dor: -",

            vital.observacoes
              ? `Observações: ${vital.observacoes}`
              : "Observações: -",

            vital.user.registroProfissional
              ? `Profissional: ${vital.user.nome} — ${vital.user.registroProfissional}`
              : `Profissional: ${vital.user.nome}`,
          ];

          doc
            .font("Helvetica")
            .fontSize(8)
            .text(detalhes.join(" | "));

          doc.moveDown(0.35);
        });
      }

      doc.end();
    } catch (error) {
      console.error(
        "[ExportVitalSignsPdfController] Erro:",
        error
      );

      return response.status(500).json({
        error: "Falha ao gerar relatório de sinais vitais",
      });
    }
  }
}

