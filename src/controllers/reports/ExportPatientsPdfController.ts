import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../../lib/prisma";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatDateTime(date: Date | null | undefined): string {
  if (!date) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function text(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }

  return String(value);
}

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
        select: {
          id: true,
          nome: true,
          dataNascimento: true,
          cpf: true,
          rg: true,
          naturalidade: true,
          estadoCivil: true,
          cartaoSus: true,
          fotoUrl: true,
          quartoLeito: true,
          genero: true,

          responsavel: true,
          telefone: true,
          responsavelCpf: true,
          responsavelGrauParentesco: true,
          responsavelEmail: true,
          responsavelEndereco: true,

          tipoSanguineo: true,
          planoSaude: true,
          contatoEmergencia: true,
          grauDependencia: true,

          historicoMedico: true,
          alergias: true,
          diagnosticos: true,
          restricaoAlimentar: true,
          observacoes: true,

          falecido: true,
          dataInternacao: true,
          dataAlta: true,

          createdAt: true,
        },
      });

      if (patients.length === 0) {
        return response.status(404).json({
          error: "Nenhum paciente ativo encontrado para gerar o relatório.",
        });
      }

      const document = new PDFDocument({
        size: "A4",
        margin: 40,
        bufferPages: true,
      });

      response.setHeader("Content-Type", "application/pdf");
      response.setHeader(
        "Content-Disposition",
        'inline; filename="relatorio-pacientes.pdf"',
      );

      document.pipe(response);

      const pageWidth = document.page.width;
      const left = document.page.margins.left;
      const right = document.page.margins.right;
      const contentWidth = pageWidth - left - right;

      const addTitle = () => {
        document
          .fontSize(18)
          .font("Helvetica-Bold")
          .text("Relatório de Pacientes", {
            align: "center",
          });

        document.moveDown(0.4);

        document
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#555555")
          .text(`Emitido em: ${formatDateTime(new Date())}`, {
            align: "center",
          });

        document.fillColor("#000000");
        document.moveDown(1);
      };

      const addSectionTitle = (title: string) => {
        if (document.y > document.page.height - 100) {
          document.addPage();
        }

        document
          .fontSize(12)
          .font("Helvetica-Bold")
          .fillColor("#047857")
          .text(title);

        document
          .moveTo(left, document.y + 3)
          .lineTo(left + contentWidth, document.y + 3)
          .strokeColor("#D1D5DB")
          .stroke();

        document.moveDown(0.5);

        document.fillColor("#000000");
      };

      const addField = (label: string, value: unknown) => {
        const startX = left;

        document
          .fontSize(9)
          .font("Helvetica-Bold")
          .text(`${label}: `, startX, document.y, {
            continued: true,
          });

        document
          .font("Helvetica")
          .text(text(value));

        document.moveDown(0.2);
      };

      addTitle();

      document
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(`Total de pacientes: ${patients.length}`);

      document.moveDown(0.8);

      patients.forEach((patient, index) => {
        if (index > 0) {
          document.addPage();

          document
            .fontSize(18)
            .font("Helvetica-Bold")
            .text("Relatório de Pacientes", {
              align: "center",
            });

          document.moveDown(0.8);
        }

        /*
         * CABEÇALHO DO PACIENTE
         */
        document
          .fontSize(14)
          .font("Helvetica-Bold")
          .fillColor("#111827")
          .text(patient.nome);

        document
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#6B7280")
          .text(`Paciente ${index + 1} de ${patients.length}`);

        document.fillColor("#000000");
        document.moveDown(0.8);

        /*
         * DADOS PESSOAIS
         */
        addSectionTitle("Dados pessoais");

        addField("Nome completo", patient.nome);
        addField("Data de nascimento", formatDate(patient.dataNascimento));
        addField("CPF", patient.cpf);
        addField("RG", patient.rg);
        addField("Naturalidade", patient.naturalidade);
        addField("Estado civil", patient.estadoCivil);
        addField("Cartão SUS", patient.cartaoSus);
        addField("Gênero", patient.genero);

        /*
         * DADOS ADMINISTRATIVOS
         */
        addSectionTitle("Dados administrativos");

        addField("Quarto / leito", patient.quartoLeito);
        addField("Plano de saúde", patient.planoSaude);

        addField(
          "Data de internação",
          formatDate(patient.dataInternacao),
        );

        addField("Data de alta", formatDate(patient.dataAlta));

        addField(
          "Situação",
          patient.falecido ? "Falecido" : "Ativo",
        );

        /*
         * RESPONSÁVEL
         */
        addSectionTitle("Responsável");

        addField("Responsável", patient.responsavel);
        addField("Telefone", patient.telefone);
        addField("CPF do responsável", patient.responsavelCpf);
        addField(
          "Grau de parentesco",
          patient.responsavelGrauParentesco,
        );
        addField("E-mail", patient.responsavelEmail);
        addField(
          "Endereço",
          patient.responsavelEndereco,
        );

        /*
         * SAÚDE
         */
        addSectionTitle("Informações de saúde");

        addField("Tipo sanguíneo", patient.tipoSanguineo);
        addField("Grau de dependência", patient.grauDependencia);
        addField(
          "Contato de emergência",
          patient.contatoEmergencia,
        );

        /*
         * INFORMAÇÕES CLÍNICAS
         */
        addSectionTitle("Informações clínicas");

        addField(
          "Histórico médico",
          patient.historicoMedico,
        );

        addField(
          "Alergias",
          patient.alergias,
        );

        addField(
          "Diagnósticos",
          patient.diagnosticos,
        );

        addField(
          "Restrição alimentar",
          patient.restricaoAlimentar,
        );

        addField(
          "Observações",
          patient.observacoes,
        );

        /*
         * IDENTIFICAÇÃO TÉCNICA
         */
        addSectionTitle("Registro do sistema");

        addField("ID do paciente", patient.id);
        addField(
          "Cadastro realizado em",
          formatDateTime(patient.createdAt),
        );
      });

      /*
       * RODAPÉ EM TODAS AS PÁGINAS
       */
      const pageCount = document.bufferedPageRange().count;

      for (let i = 0; i < pageCount; i++) {
        document.switchToPage(i);

        document
          .fontSize(8)
          .font("Helvetica")
          .fillColor("#6B7280")
          .text(
            `CareHome • Relatório de Pacientes • Página ${i + 1} de ${pageCount}`,
            left,
            document.page.height - 30,
            {
              width: contentWidth,
              align: "center",
            },
          );
      }

      document.end();
    } catch (error) {
      console.error(
        "Erro ao gerar relatório PDF de pacientes:",
        error,
      );

      if (!response.headersSent) {
        return response.status(500).json({
          error: "Erro interno ao gerar o relatório PDF de pacientes.",
        });
      }

      response.end();
    }
  }
}