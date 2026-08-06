import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListAllVitalSignsController {
  async handle(request: Request, response: Response) {
    const { search, status, startDate, endDate } = request.query;

    const where: any = {};

    // Filtro por período
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate)),
      };
    }

    // Filtro por nome do paciente
    if (search) {
      where.patient = {
        nome: {
          contains: String(search),
          mode: "insensitive",
        },
      };
    }

    const vitalSigns = await prisma.vitalSign.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
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

    const data = vitalSigns.map((item) => {
      let calculatedStatus: "normal" | "alerta" | "critico" = "normal";

      if (
        (item.saturacao ?? 100) < 90 ||
        item.temperatura >= 39 ||
        (item.frequenciaCardiaca ?? 0) >= 120 ||
        item.pressaoSistolica >= 180 ||
        item.pressaoDiastolica >= 120
      ) {
        calculatedStatus = "critico";
      } else if (
        (item.saturacao ?? 100) < 95 ||
        item.temperatura >= 37.8 ||
        item.pressaoSistolica >= 140 ||
        item.pressaoDiastolica >= 90
      ) {
        calculatedStatus = "alerta";
      }

      return {
        id: item.id,
        patientId: item.patient.id,
        patientName: item.patient.nome,

        pressaoSistolica: item.pressaoSistolica,
        pressaoDiastolica: item.pressaoDiastolica,
        pressao: `${item.pressaoSistolica}/${item.pressaoDiastolica}`,

        temperatura: item.temperatura,
        frequenciaCardiaca: item.frequenciaCardiaca,
        frequenciaRespiratoria: item.frequenciaRespiratoria,
        saturacao: item.saturacao,
        glicemia: item.glicemia,
        peso: item.peso,
        altura: item.altura,
        imc: item.imc,
        dor: item.dor,
        observacoes: item.observacoes,

        createdAt: item.createdAt,
        status: calculatedStatus,

        user: {
          nome: item.user.nome,
          cargo: item.user.cargo,
        },
      };
    });

    // Filtro pelo status calculado
    const filteredData = status
      ? data.filter((item) => item.status === String(status))
      : data;

    return response.json(filteredData);
  }
}