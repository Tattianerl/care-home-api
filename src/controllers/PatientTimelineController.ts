import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class PatientTimelineController {
  async handle(request: Request, response: Response) {
    try {
      const patientId = String(request.params.id);

      const patient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
      });

      if (!patient) {
        return response.status(404).json({
          error: "Paciente não encontrado",
        });
      }

      const [
        evolutions,
        vitalSigns,
        medications,
        documents,
        appointments,
        nutritionalAssessments,
      ] = await Promise.all([
        prisma.evolution.findMany({
          where: { patientId },
          include: {
            user: {
              select: {
                nome: true,
                cargo: true,
              },
            },
          },
        }),

        prisma.vitalSign.findMany({
          where: { patientId },
          include: {
            user: {
              select: {
                nome: true,
                cargo: true,
              },
            },
          },
        }),

        prisma.medication.findMany({
          where: { patientId },
          include: {
            user: {
              select: {
                nome: true,
                cargo: true,
              },
            },
          },
        }),

        prisma.patientDocument.findMany({
          where: {
            patientId,
            deletedAt: null,
          },
          
        }),

        prisma.appointment.findMany({
          where: { patientId },
          include: {
            user: {
              select: {
                nome: true,
                cargo: true,
              },
            },
          },
        }),

        prisma.nutritionalAssessment.findMany({
          where: { patientId },
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

      const timeline = [
        ...evolutions.map((item) => ({
          tipo: "EVOLUTION",
          data: item.createdAt,
          descricao: item.descricao,
          profissional: item.user?.nome ?? null,
          cargo: item.user?.cargo ?? null,
        })),

        ...vitalSigns.map((item) => ({
          tipo: "VITAL_SIGN",
          data: item.createdAt,
          descricao:
            `PA ${item.pressaoSistolica}/${item.pressaoDiastolica} mmHg | ` +
            `Temp ${item.temperatura}°C` +
            `${item.saturacao != null ? ` | Sat ${item.saturacao}%` : ""}` +
            `${
              item.frequenciaCardiaca != null
                ? ` | FC ${item.frequenciaCardiaca} bpm`
                : ""
            }` +
            `${item.glicemia != null ? ` | Glicemia ${item.glicemia} mg/dL` : ""}`,
          profissional: item.user?.nome ?? null,
          cargo: item.user?.cargo ?? null,
        })),

        ...medications.map((item) => ({
          tipo: "MEDICATION",
          data: item.createdAt,
          descricao: `${item.nome} - ${item.dosagem}`,
          profissional: item.user?.nome ?? null,
          cargo: item.user?.cargo ?? null,
        })),

        ...documents.map((item) => ({
          tipo: "DOCUMENT",
          data: item.createdAt,
          descricao: `${item.tipo} - ${item.nome}`,
          profissional: null,
          cargo: null,
        })),

        ...appointments.map((item) => ({
          tipo: "APPOINTMENT",
          data: item.dataHora,
          descricao: `${item.titulo} (${item.status})`,
          profissional: item.user?.nome ?? null,
          cargo: item.user?.cargo ?? null,
        })),

        ...nutritionalAssessments.map((item) => ({
          tipo: "NUTRITIONAL_ASSESSMENT",
          data: item.createdAt,
          descricao:
            `Peso: ${item.peso} kg | ` +
            `Altura: ${item.altura} m` +
            `${item.imc != null ? ` | IMC: ${item.imc.toFixed(1)}` : ""}`,
          profissional: item.user?.nome ?? null,
          cargo: item.user?.cargo ?? null,
        })),
      ];

      timeline.sort(
        (a, b) =>
          new Date(b.data).getTime() -
          new Date(a.data).getTime()
      );

      return response.json(timeline);
    } catch (error) {
      console.error("Erro ao carregar timeline do paciente:", error);

      return response.status(500).json({
        error: "Erro ao carregar timeline do paciente",
      });
    }
  }
}