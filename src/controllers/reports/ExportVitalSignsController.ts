import { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { exportCsv } from "../../utils/exportCsv";
import { formatDate } from "../../utils/formatDate";
import { formatValue } from "../../utils/formatValue";

export class ExportVitalSignsController {
  async handle(request: Request, response: Response) {
    try {
      const vitalSigns = await prisma.vitalSign.findMany({
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
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const csvData = vitalSigns.map((vital) => ({
        Paciente: vital.patient.nome,

        Pressao: `${vital.pressaoSistolica}/${vital.pressaoDiastolica} mmHg`,

        Temperatura: `${vital.temperatura} °C`,

        FrequenciaCardiaca:
          vital.frequenciaCardiaca !== null
            ? `${vital.frequenciaCardiaca} bpm`
            : "",

        FrequenciaRespiratoria:
          vital.frequenciaRespiratoria !== null
            ? `${vital.frequenciaRespiratoria} irpm`
            : "",

        Saturacao:
          vital.saturacao !== null
            ? `${vital.saturacao}%`
            : "",

        Glicemia:
          vital.glicemia !== null
            ? `${vital.glicemia} mg/dL`
            : "",

        Peso:
          vital.peso !== null
            ? `${vital.peso} kg`
            : "",

        Altura:
          vital.altura !== null
            ? `${vital.altura} m`
            : "",

        IMC:
          vital.imc !== null
            ? vital.imc.toFixed(2)
            : "",

        Dor:
          vital.dor !== null
            ? `${vital.dor}/10`
            : "",

        Observacoes: formatValue(vital.observacoes),

        Profissional: vital.user.nome,

        Cargo: vital.user.cargo,

        RegistroProfissional:
          vital.user.registroProfissional ?? "",

        Data: formatDate(vital.createdAt),
      }));

      return exportCsv(
        response,
        csvData,
        "carehome_sinais_vitais.csv"
      );
    } catch (error) {
      console.error(
        "Erro ao exportar sinais vitais:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao exportar sinais vitais.",
      });
    }
  }
}