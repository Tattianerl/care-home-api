import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DashboardTodayController {
  async handle(request: Request, response: Response) {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Cria o início do dia de amanhã para separar os "próximos" de "hoje"
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
      // Total de pacientes ativos
      prisma.patient.count({
        where: { ativo: true },
      }),

      // Total de profissionais ativos
      prisma.user.count({
        where: { ativo: true },
      }),

      // Atendimentos do dia de hoje (00:00 até 23:59)
      prisma.appointment.count({
        where: {
          dataHora: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Próximos atendimentos (A partir de amanhã em diante com status AGENDADO)
      prisma.appointment.count({
        where: {
          dataHora: {
            gte: startOfTomorrow,
          },
          status: "AGENDADO",
        },
      }),

      // Evoluções hoje
      prisma.evolution.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Documentos hoje
      prisma.patientDocument.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Sinais vitais hoje
      prisma.vitalSign.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Nutrição hoje
      prisma.nutritionalAssessment.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // Últimos pacientes
      prisma.patient.findMany({
        where: { ativo: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Últimas evoluções
      prisma.evolution.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          patient: { select: { id: true, nome: true } },
          user: { select: { nome: true, cargo: true } },
        },
      }),

      // Lista de próximos atendimentos detalhados (A partir de amanhã)
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

      // Pacientes sem evolução hoje
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
        select: { id: true, nome: true },
        take: 10,
      }),

      // Pacientes sem sinais vitais hoje
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
        select: { id: true, nome: true },
        take: 10,
      }),

      // Auditoria recente
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          user: { select: { nome: true, cargo: true } },
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
  }
}