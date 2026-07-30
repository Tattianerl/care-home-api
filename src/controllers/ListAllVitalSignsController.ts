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
        (item.temperatura ?? 0) >= 39 ||
        (item.frequenciaCardiaca ?? 0) >= 120
      ) {
        calculatedStatus = "critico";
      } else if (
        (item.saturacao ?? 100) < 95 ||
        (item.temperatura ?? 0) >= 37.8 ||
        item.pressao.startsWith("14") ||
        item.pressao.startsWith("15")
      ) {
        calculatedStatus = "alerta";
      }

      return {
        id: item.id,
        patientId: item.patient.id,
        patientName: item.patient.nome,

        pressao: item.pressao,
        glicemia: item.glicemia,
        temperatura: item.temperatura,
        frequenciaCardiaca: item.frequenciaCardiaca,
        saturacao: item.saturacao,

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
