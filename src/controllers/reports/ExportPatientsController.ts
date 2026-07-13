import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportPatientsController {
  async handle(request: Request, response: Response) {
    const patients = await prisma.patient.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    const csvData = patients.map((patient) => ({
      Nome: patient.nome,
      Responsavel: patient.responsavel,
      Telefone: patient.telefone,
      DataNascimento: formatDate(patient.dataNascimento, false),
      HistoricoMedico: formatValue(patient.historicoMedico),
      Alergias: formatValue(patient.alergias),
      Diagnosticos: formatValue(patient.diagnosticos),
    }));

    return exportCsv(
      response,
      csvData,
      "carehome_pacientes.csv"
    );
  }
}