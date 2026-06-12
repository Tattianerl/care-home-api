import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

    const csvRows = [
      [
        "Nome",
        "Responsavel",
        "Telefone",
        "DataNascimento",
        "HistoricoMedico",
        "Alergias",
        "Diagnosticos",
      ].join(","),
    ];

    patients.forEach((patient) => {
      csvRows.push([
        `"${patient.nome}"`,
        `"${patient.responsavel}"`,
        `"${patient.telefone}"`,
        `"${patient.dataNascimento.toLocaleDateString("pt-BR")}"`,
        `"${patient.historicoMedico ?? ""}"`,
        `"${patient.alergias ?? ""}"`,
        `"${patient.diagnosticos ?? ""}"`,
      ].join(","));
    });

    const csv = csvRows.join("\n");

    response.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    response.setHeader(
      "Content-Disposition",
      'attachment; filename="pacientes.csv"'
    );

    return response.status(200).send(csv);
  }
}