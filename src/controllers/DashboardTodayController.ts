import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DashboardTodayController {
  async handle(request: Request, response: Response) {
    try {
      const today = new Date();

      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const startOfTomorrow = new Date(startOfDay);
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

      const [
        pacientesAtivos,
        profissionaisAtivos,
        atendimentosHoje,
        proximosAtendimentos,
        evolucoesHoje,
        documentosHoje,
        sinaisVitaisHoje,
        avaliacoesNutricionaisHoje,
        ultimosPacientes,
        ultimasEvolucoes,
        proximosAtendimentosDetalhados,
        pacientesSemEvolucaoHoje,
        pacientesSemSinaisVitaisHoje,
        atividadeRecente,
      ] = await Promise.all([
        prisma.patient.count({
          where: { ativo: true },
        }),

        prisma.user.count({
          where: { ativo: true },
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
              gte: startOfTomorrow,
            },
            status: "AGENDADO",
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
            deletedAt: null,
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

        prisma.nutritionalAssessment.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),

        prisma.patient.findMany({
          where: { ativo: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),

        prisma.evolution.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
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
        }),

        prisma.appointment.findMany({
          where: {
            dataHora: {
              gte: startOfTomorrow,
            },
            status: "AGENDADO",
          },
          orderBy: {
            dataHora: "asc",
          },
          take: 5,
          include: {
            patient: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        }),

        prisma.patient.findMany({
          where: {
            ativo: true,
            evolutions: {
              none: {
                createdAt: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            },
          },
          select: {
            id: true,
            nome: true,
          },
          take: 10,
        }),

        prisma.patient.findMany({
          where: {
            ativo: true,
            vitalSigns: {
              none: {
                createdAt: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            },
          },
          select: {
            id: true,
            nome: true,
          },
          take: 10,
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

      const pendencias = [
        ...pacientesSemEvolucaoHoje.map((patient) => ({
          tipo: "EVOLUTION",
          mensagem: `${patient.nome} está sem evolução hoje`,
        })),

        ...pacientesSemSinaisVitaisHoje.map((patient) => ({
          tipo: "VITAL_SIGN",
          mensagem: `${patient.nome} está sem sinais vitais hoje`,
        })),
      ];

      return response.status(200).json({
        pacientesAtivos,
        profissionaisAtivos,

        atendimentosHoje,
        proximosAtendimentos,

        evolucoesHoje,
        documentosHoje,
        sinaisVitaisHoje,
        avaliacoesNutricionaisHoje,

        ultimosPacientes,
        ultimasEvolucoes,
        proximosAtendimentosDetalhados,

        pendencias,
        atividadeRecente,

        dataReferencia: today,
      });
    } catch (error) {
      console.error(
        "Erro ao carregar dashboard do dia:",
        error
      );

      return response.status(500).json({
        error: "Erro ao carregar dados do dashboard.",
      });
    }
  }
}

