import { Request, Response } from "express";
import PDFDocument from "pdfkit";

import { prisma } from "../../lib/prisma";

export class GeneratePatientReportController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      include: {
        evolutions: {
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
        },

        medications: {
          include: {
            user: {
              select: {
                nome: true,
              },
            },
            prescritoPor: {
              select: {
                nome: true,
              },
            },
          },
        },

        vitalSigns: {
          include: {
            user: {
              select: {
                nome: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        documents: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!patient) {
      return response.status(404).json({
        error: "Paciente não encontrado.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: request.user!.id,
      },
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

    const doc = new PDFDocument({
      margin: 45,
      size: "A4",
    });

    doc.pipe(response);

    //------------------------------------------------------
    // CABEÇALHO
    //------------------------------------------------------

    doc
      .fontSize(22)
      .fillColor("#0F766E")
      .text("CARE HOME", {
        align: "center",
      });

    doc
      .fontSize(16)
      .fillColor("black")
      .text("Prontuário Completo do Paciente", {
        align: "center",
      });

    doc.moveDown(2);

    //------------------------------------------------------
    // DADOS DO PACIENTE
    //------------------------------------------------------

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Dados do Paciente");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    doc.text(`Nome: ${patient.nome}`);
    doc.text(
      `Data de nascimento: ${patient.dataNascimento.toLocaleDateString("pt-BR")}`
    );

    doc.text(`CPF: ${patient.cpf ?? "-"}`);
    doc.text(`RG: ${patient.rg ?? "-"}`);

    doc.text(`Sexo: ${patient.genero}`);

    doc.text(`Naturalidade: ${patient.naturalidade ?? "-"}`);

    doc.text(`Estado civil: ${patient.estadoCivil ?? "-"}`);

    doc.text(`Cartão SUS: ${patient.cartaoSus ?? "-"}`);

    doc.text(`Quarto / Leito: ${patient.quartoLeito ?? "-"}`);

    doc.moveDown();

    //------------------------------------------------------
    // RESPONSÁVEL
    //------------------------------------------------------

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Responsável");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    doc.text(`Nome: ${patient.responsavel}`);

    doc.text(`Telefone: ${patient.telefone}`);

    doc.text(
      `CPF: ${patient.responsavelCpf ?? "-"}`
    );

    doc.text(
      `Parentesco: ${patient.responsavelGrauParentesco ?? "-"}`
    );

    doc.text(
      `E-mail: ${patient.responsavelEmail ?? "-"}`
    );

    doc.text(
      `Endereço: ${patient.responsavelEndereco ?? "-"}`
    );

    doc.moveDown();

    //------------------------------------------------------
    // DADOS CLÍNICOS
    //------------------------------------------------------

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Dados Clínicos");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    doc.text(
      `Tipo sanguíneo: ${patient.tipoSanguineo ?? "-"}`
    );

    doc.text(
      `Plano de saúde: ${patient.planoSaude ?? "-"}`
    );

    doc.text(
      `Contato de emergência: ${patient.contatoEmergencia ?? "-"}`
    );

    doc.text(
      `Grau de dependência: ${patient.grauDependencia ?? "-"}`
    );

    doc.moveDown();

    doc.text(
      `Histórico médico: ${patient.historicoMedico ?? "-"}`
    );

    doc.moveDown();

    doc.text(
      `Alergias: ${patient.alergias ?? "-"}`
    );

    doc.moveDown();

    doc.text(
      `Diagnósticos: ${patient.diagnosticos ?? "-"}`
    );

    doc.moveDown();

    doc.text(
      `Restrições alimentares: ${patient.restricaoAlimentar ?? "-"}`
    );

    doc.moveDown();

    doc.text(
      `Observações: ${patient.observacoes ?? "-"}`
    );

    doc.moveDown(2);

        //------------------------------------------------------
    // MEDICAMENTOS
    //------------------------------------------------------

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Medicamentos");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    if (patient.medications.length === 0) {
      doc.text("Nenhum medicamento cadastrado.");
    } else {
      patient.medications.forEach((medication) => {
        doc
          .font("Helvetica-Bold")
          .text(medication.nome);

        doc.font("Helvetica");

        doc.text(`Dosagem: ${medication.dosagem}`);
        doc.text(`Frequência: ${medication.frequencia}`);
        doc.text(`Via: ${medication.viaAdministracao}`);
        doc.text(`Status: ${medication.status}`);

        doc.text(
          `Uso contínuo: ${medication.usoContinuo ? "Sim" : "Não"}`
        );

        doc.text(
          `Controlado: ${medication.controlado ? "Sim" : "Não"}`
        );

        doc.text(
          `Prescrito por: ${
            medication.prescritoPor?.nome ?? "-"
          }`
        );

        doc.text(
          `Lançado por: ${
            medication.user.nome
          }`
        );

        if (medication.observacoes) {
          doc.text(
            `Observações: ${medication.observacoes}`
          );
        }

        doc.moveDown();
      });
    }

    doc.moveDown(2);

    //------------------------------------------------------
    // SINAIS VITAIS
    //------------------------------------------------------

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Sinais Vitais");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    if (patient.vitalSigns.length === 0) {
      doc.text("Nenhum sinal vital registrado.");
    } else {
      patient.vitalSigns.forEach((vital) => {
        doc
          .font("Helvetica-Bold")
          .text(
            new Date(vital.createdAt).toLocaleString("pt-BR")
          );

        doc.font("Helvetica");

        doc.text(
          `Pressão Arterial: ${vital.pressaoSistolica}/${vital.pressaoDiastolica} mmHg`
        );

        doc.text(
          `Temperatura: ${vital.temperatura} °C`
        );

        doc.text(
          `Frequência Cardíaca: ${
            vital.frequenciaCardiaca ?? "-"
          } bpm`
        );

        doc.text(
          `Frequência Respiratória: ${
            vital.frequenciaRespiratoria ?? "-"
          } irpm`
        );

        doc.text(
          `Saturação: ${vital.saturacao ?? "-"} %`
        );

        doc.text(
          `Glicemia: ${vital.glicemia ?? "-"} mg/dL`
        );

        doc.text(
          `Peso: ${vital.peso ?? "-"} kg`
        );

        doc.text(
          `Altura: ${vital.altura ?? "-"} m`
        );

        doc.text(
          `IMC: ${vital.imc ?? "-"}`
        );

        doc.text(
          `Dor (0-10): ${vital.dor ?? "-"}`
        );

        if (vital.observacoes) {
          doc.text(
            `Observações: ${vital.observacoes}`
          );
        }

        doc.text(
          `Profissional: ${vital.user.nome}`
        );

        doc.moveDown();
      });
    }

    doc.moveDown(2);

    //------------------------------------------------------
    // EVOLUÇÕES
    //------------------------------------------------------

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Evoluções");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    if (patient.evolutions.length === 0) {
      doc.text("Nenhuma evolução registrada.");
    } else {
      patient.evolutions.forEach((evolution) => {

        doc
          .font("Helvetica-Bold")
          .text(
            new Date(
              evolution.createdAt
            ).toLocaleString("pt-BR")
          );

        doc.font("Helvetica");

        doc.text(
          `Profissional: ${evolution.user.nome}`
        );

        doc.text(
          `Cargo: ${evolution.user.cargo}`
        );

        doc.moveDown(0.3);

        doc.text(evolution.descricao);

        doc.moveDown();

      });
    }

    doc.moveDown(2);

    //------------------------------------------------------
    // DOCUMENTOS
    //------------------------------------------------------

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Documentos");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    if (patient.documents.length === 0) {

      doc.text("Nenhum documento anexado.");

    } else {

      patient.documents.forEach((document) => {

        doc
          .font("Helvetica-Bold")
          .text(document.nome);

        doc.font("Helvetica");

        doc.text(`Tipo: ${document.tipo}`);

        doc.text(
          `Data: ${new Date(
            document.createdAt
          ).toLocaleDateString("pt-BR")}`
        );

        if (document.deletedAt) {

          doc.fillColor("red");

          doc.text(
            `Documento excluído em ${new Date(
              document.deletedAt
            ).toLocaleDateString("pt-BR")}`
          );

          doc.text(
            `Excluído por: ${document.deletedBy}`
          );

          doc.fillColor("black");
        }

        doc.moveDown();

      });

    }

    doc.moveDown(2);

        //------------------------------------------------------
    // PROFISSIONAL RESPONSÁVEL
    //------------------------------------------------------

    if (doc.y > 650) {
      doc.addPage();
    }

    doc
      .fontSize(16)
      .fillColor("#0F766E")
      .text("Profissional Responsável");

    doc.moveDown();

    doc.fontSize(11).fillColor("black");

    doc.text(`Nome: ${user?.nome ?? "-"}`);
    doc.text(`Cargo: ${user?.cargo ?? "-"}`);

    if (user?.registroProfissional) {
      doc.text(
        `Registro Profissional: ${user.registroProfissional}`
      );
    }

    doc.moveDown();

    if (user?.assinatura) {
      doc.font("Helvetica-Bold").text("Assinatura Digital:");

      doc.font("Helvetica");

      doc.fillColor("blue");

      doc.text(user.assinatura, {
        link: user.assinatura,
        underline: true,
      });

      doc.fillColor("black");

      doc.moveDown(0.5);

      doc.fontSize(10);

      doc.text(
        "A assinatura digital encontra-se armazenada de forma segura no repositório da Care Home."
      );

      doc.fontSize(11);

      doc.moveDown();
    }

    //------------------------------------------------------
    // RODAPÉ
    //------------------------------------------------------

    doc.moveDown();

    doc
      .strokeColor("#D1D5DB")
      .lineWidth(1)
      .moveTo(45, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown();

    doc
      .fontSize(10)
      .fillColor("#6B7280")
      .text(
        `Relatório emitido em ${new Date().toLocaleString("pt-BR")}`,
        {
          align: "center",
        }
      );

    doc.text(
      "Care Home - Sistema de Gestão para Casa de Repouso",
      {
        align: "center",
      }
    );

    doc.text(
      "Documento gerado automaticamente pelo prontuário eletrônico.",
      {
        align: "center",
      }
    );

    doc.end();
  }
}