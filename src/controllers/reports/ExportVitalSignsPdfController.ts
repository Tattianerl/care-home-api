import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import PDFDocument from "pdfkit-table";

export class ExportVitalSignsPdfController {
  async handle(request: Request, response: Response) {
    try {
      const { patientId } = request.query;
      const whereCondition = patientId ? { patientId: String(patientId) } : {};

      const vitals = await prisma.vitalSign.findMany({
        where: whereCondition,
        include: {
          patient: { select: { nome: true } },
          user: { select: { nome: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const doc = new PDFDocument({ margin: 40, size: "A4" });

      response.setHeader("Content-Type", "application/pdf");
      response.setHeader("Content-Disposition", 'attachment; filename="sinais_vitais.pdf"');

      doc.pipe(response);

      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0284c7").text("Care Home");
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#1e293b").text("Relatório de Sinais Vitais");
      doc.moveDown(1);

      const tableData = {
        title: "Registros Recentes",
        headers: ["Data", "Paciente", "P.A.", "Temp (°C)", "Glicemia", "FC (bpm)", "Sat (%)", "Resp."],
        rows: vitals.map((v) => [
          new Date(v.createdAt).toLocaleDateString("pt-BR"),
          v.patient.nome,
          v.pressao,
          `${v.temperatura}`,
          v.glicemia ? `${v.glicemia}` : "-",
          v.frequenciaCardiaca ? `${v.frequenciaCardiaca}` : "-",
          v.saturacao ? `${v.saturacao}%` : "-",
          v.user.nome,
        ]),
      };

      await doc.table(tableData, { prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8), prepareRow: () => doc.font("Helvetica").fontSize(8) });

      doc.end();
    } catch (error) {
      console.error("[ExportVitalSignsPdfController] Erro:", error);
      return response.status(500).json({ error: "Falha ao gerar relatório de sinais vitais" });
    }
  }
}