import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import PDFDocument from "pdfkit-table";

export class ExportVitalSignsPdfController {
  async handle(request: Request, response: Response) {
    try {
      const { patientId } = request.query;

      const whereCondition = patientId
        ? { patientId: String(patientId) }
        : {};

      const vitals = await prisma.vitalSign.findMany({
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


      response.setHeader(
        "Content-Type",
        "application/pdf"
      );

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


      doc.moveDown(1);


      const tableData = {
        title: "Registros Recentes",

        headers: [
          "Data",
          "Paciente",
          "P.A.",
          "Temp",
          "Glicemia",
          "FC",
          "Sat",
          "Resp",
          "Profissional",
        ],


        rows: vitals.map((vital) => [
          new Date(vital.createdAt)
            .toLocaleDateString("pt-BR"),

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


          vital.user.nome,
        ]),
      };


      await doc.table(
        tableData,
        {
          prepareHeader: () =>
            doc
              .font("Helvetica-Bold")
              .fontSize(8),

          prepareRow: () =>
            doc
              .font("Helvetica")
              .fontSize(8),
        }
      );


      doc.end();

    } catch (error) {

      console.error(
        "[ExportVitalSignsPdfController] Erro:",
        error
      );


      return response.status(500).json({
        error:
          "Falha ao gerar relatório de sinais vitais",
      });
    }
  }
}