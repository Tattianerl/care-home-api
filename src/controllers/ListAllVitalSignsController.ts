import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { evaluateVitalStatus } from "../utils/evaluateVitalStatus";

export class ListAllVitalSignsController {
  async handle(request: Request, response: Response) {
    try {
      const {
        search,
        status,
        startDate,
        endDate,
      } = request.query;

      const where: Prisma.VitalSignWhereInput = {};

      if (search) {
        where.patient = {
          nome: {
            contains: String(search),
            mode: "insensitive",
          },
        };
      }

      if (startDate || endDate) {
        where.createdAt = {};

        if (startDate) {
          where.createdAt.gte = new Date(
            String(startDate)
          );
        }

        if (endDate) {
          const end = new Date(
            String(endDate)
          );

          end.setHours(23, 59, 59, 999);

          where.createdAt.lte = end;
        }
      }

      const vitalSigns =
        await prisma.vitalSign.findMany({
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
        const statusCalculado =
          evaluateVitalStatus(item);

        return {
          id: item.id,

          patientId: item.patient.id,
          patientName: item.patient.nome,

          pressaoSistolica:
            item.pressaoSistolica,

          pressaoDiastolica:
            item.pressaoDiastolica,

          pressao: `${item.pressaoSistolica}/${item.pressaoDiastolica}`,

          temperatura: item.temperatura,

          frequenciaCardiaca:
            item.frequenciaCardiaca,

          frequenciaRespiratoria:
            item.frequenciaRespiratoria,

          saturacao: item.saturacao,

          glicemia: item.glicemia,

          peso: item.peso,

          altura: item.altura,

          imc: item.imc,

          dor: item.dor,

          observacoes: item.observacoes,

          createdAt: item.createdAt,

          status: statusCalculado,

          user: {
            nome: item.user.nome,
            cargo: item.user.cargo,
          },
        };
      });

      const filteredData = status
        ? data.filter(
            (item) =>
              item.status === String(status)
          )
        : data;

      return response.json(filteredData);
    } catch (error) {
      console.error(
        "Erro ao listar sinais vitais:",
        error
      );

      return response.status(500).json({
        error: "Erro ao listar sinais vitais.",
      });
    }
  }
}