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

      pacientesSemEvolucaoHoje,
      pacientesSemSinaisVitaisHoje,

      atividadeRecente,

    ] = await Promise.all([


      // Total pacientes ativos
      prisma.patient.count({
        where: {
          ativo: true,
        },
      }),


      // Profissionais ativos
      prisma.user.count({
        where: {
          ativo: true,
        },
      }),


      // Atendimentos realizados hoje
      prisma.appointment.count({
        where: {
          dataHora: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),


      // Próximos atendimentos
      prisma.appointment.count({
        where: {
          dataHora: {
            gte: today,
          },
        },
      }),


      // Evoluções registradas hoje
      prisma.evolution.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),


      // Documentos enviados hoje
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



      // Últimos pacientes cadastrados
      prisma.patient.findMany({
        where:{
          ativo:true,
        },

        orderBy:{
          createdAt:"desc",
        },

        take:5,
      }),



      // Últimas evoluções
      prisma.evolution.findMany({

        orderBy:{
          createdAt:"desc",
        },

        take:5,

        include:{
          patient:{
            select:{
              nome:true,
            },
          },

          user:{
            select:{
              nome:true,
              cargo:true,
            },
          },
        },
      }),



      // Próximos atendimentos detalhados
      prisma.appointment.findMany({

        where:{
          dataHora:{
            gte:today,
          },
        },

        orderBy:{
          dataHora:"asc",
        },

        take:5,

        include:{
          patient:{
            select:{
              nome:true,
            },
          },
        },
      }),



      // Pacientes sem evolução hoje
      prisma.patient.findMany({

        where:{

          ativo:true,

          evolutions:{
            none:{
              createdAt:{
                gte:startOfDay,
                lte:endOfDay,
              },
            },
          },

        },

        select:{
          id:true,
          nome:true,
        },

        take:10,
      }),




      // Pacientes sem sinais vitais hoje
      prisma.patient.findMany({

        where:{

          ativo:true,

          vitalSigns:{
            none:{
              createdAt:{
                gte:startOfDay,
                lte:endOfDay,
              },
            },
          },

        },

        select:{
          id:true,
          nome:true,
        },

        take:10,
      }),




      // Auditoria recente
      prisma.auditLog.findMany({

        orderBy:{
          createdAt:"desc",
        },

        take:8,

        include:{
          user:{
            select:{
              nome:true,
              cargo:true,
            },
          },
        },
      }),


    ]);



    // Monta pendências dinamicamente
    const pendencias = [

      ...pacientesSemEvolucaoHoje.map((patient)=>({
        tipo:"EVOLUTION",
        mensagem:`${patient.nome} está sem evolução hoje`,
      })),


      ...pacientesSemSinaisVitaisHoje.map((patient)=>({
        tipo:"VITAL_SIGN",
        mensagem:`${patient.nome} está sem sinais vitais hoje`,
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



      ultimosPacientes,

      ultimasEvolucoes,

      proximosAtendimentosDetalhados,


      pendencias,


      atividadeRecente,


      dataReferencia: today,

    });
  }
}