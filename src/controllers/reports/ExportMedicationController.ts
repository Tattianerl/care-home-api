import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportMedicationController {
  async handle(request: Request, response: Response) {
    const medications = await prisma.medication.findMany({
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

    const csvData = medications.map((medication) => ({
      Paciente: medication.patient.nome,
      Medicamento: medication.nome,
      Dosagem: medication.dosagem,
      Frequencia: medication.frequencia,
      Via: medication.viaAdministracao,
      Observacoes: formatValue(medication.observacoes),
      Profissional: medication.user.nome,
      Cargo: medication.user.cargo,
      Data: formatDate(medication.createdAt),
    }));

    return exportCsv(
      response,
      csvData,
      "carehome_medicacoes.csv"
    );
  }
}