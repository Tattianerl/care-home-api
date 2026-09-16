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
        atividadeRecente,
      ] = await Promise.all([
        /*
         * ============================================================
         * PACIENTES ATIVOS
         * ============================================================
         */

        prisma.patient.count({
          where: {
            ativo: true,
          },
        }),

        /*
         * ============================================================
         * PROFISSIONAIS ATIVOS
         * ============================================================
         */

        prisma.user.count({
          where: {
            ativo: true,
          },
        }),

        /*
         * ============================================================
         * ATENDIMENTOS DE HOJE
         * ============================================================
         */

        prisma.appointment.count({
          where: {
            dataHora: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),

        /*
         * ============================================================
         * PRÓXIMOS ATENDIMENTOS
         * ============================================================
         */

        prisma.appointment.count({
          where: {
            dataHora: {
              gte: startOfTomorrow,
            },
            status: "AGENDADO",
          },
        }),

        /*
         * ============================================================
         * EVOLUÇÕES REGISTRADAS HOJE
         * ============================================================
         */

        prisma.evolution.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),

        /*
         * ============================================================
         * DOCUMENTOS REGISTRADOS HOJE
         * ============================================================
         */

        prisma.patientDocument.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
            deletedAt: null,
          },
        }),

        /*
         * ============================================================
         * SINAIS VITAIS REGISTRADOS HOJE
         * ============================================================
         */

        prisma.vitalSign.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),

        /*
         * ============================================================
         * AVALIAÇÕES NUTRICIONAIS REGISTRADAS HOJE
         * ============================================================
         */

        prisma.nutritionalAssessment.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),

        /*
         * ============================================================
         * ÚLTIMOS PACIENTES
         * ============================================================
         */

        prisma.patient.findMany({
          where: {
            ativo: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        }),

        /*
         * ============================================================
         * ÚLTIMAS EVOLUÇÕES
         * ============================================================
         */

        prisma.evolution.findMany({
          orderBy: {
            createdAt: "desc",
          },
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
                id: true,
                nome: true,
                cargo: true,
                registroProfissional: true,
              },
            },
          },
        }),

        /*
         * ============================================================
         * PRÓXIMOS ATENDIMENTOS DETALHADOS
         * ============================================================
         */

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

        /*
         * ============================================================
         * ATIVIDADE RECENTE
         * ============================================================
         */

        prisma.auditLog.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 8,
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                cargo: true,
              },
            },
          },
        }),
      ]);

      /*
       * ============================================================
       * PENDÊNCIAS
       * ============================================================
       *
       * Não criamos pendências clínicas automaticamente para:
       *
       * - paciente sem evolução no dia;
       * - paciente sem sinal vital no dia.
       *
       * Essas regras dependem da rotina institucional e não estão
       * definidas no Prisma.
       */

      const pendencias: Array<{
        tipo: string;
        mensagem: string;
      }> = [];

      /*
       * ============================================================
       * RESPOSTA
       * ============================================================
       */

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