import { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportMedicationController {
  async handle(request: Request, response: Response) {
    try {
      const medications = await prisma.medication.findMany({
        include: {
          patient: {
            select: {
              id: true,
              nome: true,
            },
          },
          user: {
            select: {
              id: true,
              nome: true,
              cargo: true,
              registroProfissional: true,
            },
          },
          prescritoPor: {
            select: {
              id: true,
              nome: true,
              cargo: true,
              registroProfissional: true,
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
        RegistroProfissional:
          medication.user.registroProfissional ?? "",
        PrescritoPor: medication.prescritoPor?.nome ?? "",
        CargoPrescritor: medication.prescritoPor?.cargo ?? "",
        RegistroPrescritor:
          medication.prescritoPor?.registroProfissional ?? "",
        Data: formatDate(medication.createdAt),
      }));

      return exportCsv(
        response,
        csvData,
        "carehome_medicacoes.csv"
      );
    } catch (error) {
      console.error(
        "Erro ao exportar medicações:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao exportar medicações.",
      });
    }
  }
}