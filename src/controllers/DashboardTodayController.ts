import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DashboardTodayController {
  async handle(request: Request, response: Response) {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      pacientesAtivos,
      profissionaisAtivos,

      atendimentosHoje,
      proximosAtendimentos,
      evolucoesHoje,
      documentosHoje,
      sinaisVitaisHoje,

      ultimosPacientes,
      ultimasEvolucoes,
      proximosAtendimentosDetalhados,

      atividadeRecente,
    ] = await Promise.all([
      prisma.patient.count({
        where: {
          ativo: true,
        },
      }),

      prisma.user.count({
          where: {
            ativo: true,
          },
        }),

      prisma.appointment.count({
        where: {
          dataHora: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.appointment.count({
        where: {
          dataHora: {
            gte: today,
          },
        },
      }),

      prisma.evolution.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.patientDocument.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.vitalSign.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.patient.findMany({
        where: {
          ativo: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      prisma.evolution.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          patient: {
            select: {
              nome: true,
            },
          },
        },
      }),

      prisma.appointment.findMany({
        where: {
          dataHora: {
            gte: today,
          },
        },
        orderBy: {
          dataHora: "asc",
        },
        take: 5,
        include: {
          patient: {
            select: {
              nome: true,
            },
          },
        },
      }),

      prisma.auditLog.findMany({
          orderBy: {
            createdAt: "desc",
          },

          take: 8,

          include: {
            user: {
              select: {
                nome: true,
                cargo: true,
              },
            },
          },
        }),
    ]);

    return response.status(200).json({
      pacientesAtivos,
      profissionaisAtivos,

      atendimentosHoje,
      proximosAtendimentos,
      evolucoesHoje,
      documentosHoje,
      sinaisVitaisHoje,

      ultimosPacientes,
      ultimasEvolucoes,
      proximosAtendimentosDetalhados,

      atividadeRecente,

      dataReferencia: today,
    });
  }
}