import { Response } from "express";
import PDFDocument from "pdfkit-table";
import axios from "axios";

export interface PDFEvolutionItem {
  data: string;
  paciente: string;
  profissional: string;
  cargo: string;
  descricao: string;
  assinaturaUrl?: string | null;
}

interface ExportEvolutionsOptions {
  title: string;
  subtitle?: string;
  filename: string;
  items: PDFEvolutionItem[];
}

/**
 * Faz download da imagem da assinatura no Supabase Bucket e devolve um Buffer
 */
async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`[PDF Export] Erro ao carregar assinatura do Supabase: ${url}`);
    return null;
  }
}

export async function generateEvolutionsPdf(
  response: Response,
  options: ExportEvolutionsOptions
) {
  const { title, subtitle, filename, items } = options;

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  // Configura os headers de resposta HTTP para download de PDF
  response.setHeader("Content-Type", "application/pdf");
  response.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  doc.pipe(response);

  // --- CABEÇALHO ---
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#0284c7")
    .text("Care Home — Gestão de Saúde");

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#1e293b")
    .text(title);

  if (subtitle) {
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(subtitle);
  }

  doc.moveDown(1.5);

  if (items.length === 0) {
    doc.fontSize(10).font("Helvetica-Oblique").fillColor("#64748b").text("Nenhum registro encontrado.");
    doc.end();
    return;
  }

  // --- LISTA DE EVOLUÇÕES ---
  for (const item of items) {
    // Evita quebra de página inadequada no meio do bloco de assinatura
    if (doc.y > 640) {
      doc.addPage();
    }

    // Cabeçalho da evolução
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text(`Paciente: ${item.paciente} — ${item.data}`);

    doc.moveDown(0.3);

    // Texto da evolução
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#334155")
      .text(item.descricao, { align: "justify" });

    doc.moveDown(0.5);

    // Tenta renderizar a assinatura do Supabase
    if (item.assinaturaUrl) {
      const imgBuffer = await fetchImageBuffer(item.assinaturaUrl);
      // Tenta renderizar a assinatura do Supabase
    if (item.assinaturaUrl) {
      const imgBuffer = await fetchImageBuffer(item.assinaturaUrl);
      if (imgBuffer) {
        doc.image(imgBuffer, {
          fit: [140, 45] as [number, number],
        });
        doc.moveDown(0.3);
      }
    }
    }

    // Identificação do Profissional Responsável
    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor("#475569")
      .text(`${item.profissional} — ${item.cargo}`);

    doc.moveDown(0.8);

    // Linha divisória
    doc
      .strokeColor("#e2e8f0")
      .lineWidth(0.5)
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke();

    doc.moveDown(1);
  }

  doc.end();
}