import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportVitalSignsController {
  async handle(request: Request, response: Response) {
    const vitalSigns = await prisma.vitalSign.findMany({
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

    const csvData = vitalSigns.map((vital) => ({
        Paciente: vital.patient.nome,
        Pressao: vital.pressao,
        Temperatura: `${vital.temperatura} °C`,
        Glicemia:
          vital.glicemia !== null
            ? `${vital.glicemia} mg/dL`
            : "",
        FrequenciaCardiaca:
          vital.frequenciaCardiaca !== null
            ? `${vital.frequenciaCardiaca} bpm`
            : "",
        Saturacao:
          vital.saturacao !== null
            ? `${vital.saturacao}%`
            : "",
        Observacoes: formatValue(vital.observacoes),
        Profissional: vital.user.nome,
        Cargo: vital.user.cargo,
        Data: formatDate(vital.createdAt),
      })
    );
    return exportCsv(
      response,
      csvData,
      "carehome_sinais_vitais.csv"
    );

    
  }
}
