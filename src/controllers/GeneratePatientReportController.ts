import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

import { prisma } from "../lib/prisma";

export class GeneratePatientReportController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        evolutions: true,
        vitalSigns: true,
        medications: true,
        documents: true,
      },
    });

    if (!patient) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    const userId = request.user?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const doc = new PDFDocument({
      margin: 50,
    });

    const fileName = `Prontuario_${patient.nome.replace(/\s/g, "_")}.pdf`;

    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    response.setHeader(
      "Content-Type",
      "application/pdf"
    );

    doc.pipe(response);

    // Título

    doc
      .fontSize(20)
      .text("PRONTUÁRIO DO PACIENTE", {
        align: "center",
      });

    doc.moveDown();

    // Dados do paciente

    doc
      .fontSize(16)
      .text("Dados do Paciente");

    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text(`Nome: ${patient.nome}`);
    doc.text(`Responsável: ${patient.responsavel}`);
    doc.text(`Telefone: ${patient.telefone}`);
    doc.text(
      `Data de nascimento: ${patient.dataNascimento.toLocaleDateString(
        "pt-BR"
      )}`
    );

    doc.moveDown();

    // Medicamentos

    doc
      .fontSize(16)
      .text("Medicamentos");

    doc.moveDown(0.5);

    if (patient.medications.length === 0) {
      doc.text("Nenhum medicamento cadastrado.");
    } else {
      patient.medications.forEach((medication) => {
        doc.text(
          `• ${medication.nome} - ${medication.dosagem} - ${medication.frequencia}`
        );
      });
    }

    doc.moveDown();

    // Sinais vitais

    doc
      .fontSize(16)
      .text("Sinais Vitais");

    doc.moveDown(0.5);

    if (patient.vitalSigns.length === 0) {
      doc.text("Nenhum sinal vital registrado.");
    } else {
      patient.vitalSigns.forEach((vital) => {
        doc.text(
          `• Pressão: ${vital.pressao} | Temp: ${vital.temperatura}°C | Saturação: ${vital.saturacao ?? "-"}`
        );
      });
    }

    doc.moveDown();

    // Evoluções

    doc
      .fontSize(16)
      .text("Evoluções");

    doc.moveDown(0.5);

    if (patient.evolutions.length === 0) {
      doc.text("Nenhuma evolução registrada.");
    } else {
      patient.evolutions.forEach((evolution) => {
        doc.text(
          `• ${new Date(
            evolution.createdAt
          ).toLocaleDateString("pt-BR")} - ${evolution.descricao}`
        );
      });
    }

    

    doc.moveDown(2);

    doc
      .fontSize(16)
      .text("Profissional Responsável");

    doc.moveDown(0.5);

    doc.fontSize(12);

    doc.text(`Nome: ${user?.nome ?? "-"}`);
    doc.text(`Cargo: ${user?.cargo ?? "-"}`);

    if (user?.assinatura) {

      const signaturePath = path.resolve(
        __dirname,
        "../../uploads",
        user.assinatura
      );

      if (fs.existsSync(signaturePath)) {

        doc.moveDown();

        doc.image(signaturePath, {
          width: 80,
        });

      }
    }

    doc.text(
      `Relatório emitido em ${new Date().toLocaleString("pt-BR")}`
    );

    doc.end();
  }
}