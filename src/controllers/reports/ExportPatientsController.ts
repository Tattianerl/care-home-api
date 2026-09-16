import { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportPatientsController {
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
          nome: true,
          responsavel: true,
          telefone: true,
          dataNascimento: true,
          historicoMedico: true,
          alergias: true,
          diagnosticos: true,
        },
      });

      const csvData = patients.map((patient) => ({
        Nome: patient.nome,
        Responsavel: patient.responsavel,
        Telefone: patient.telefone,
        DataNascimento: formatDate(
          patient.dataNascimento,
          false
        ),
        HistoricoMedico: formatValue(
          patient.historicoMedico
        ),
        Alergias: formatValue(patient.alergias),
        Diagnosticos: formatValue(
          patient.diagnosticos
        ),
      }));

      return exportCsv(
        response,
        csvData,
        "carehome_pacientes.csv"
      );
    } catch (error) {
      console.error(
        "Erro ao exportar pacientes:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao exportar pacientes.",
      });
    }
  }
}