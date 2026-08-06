import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class PatientTimelineController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;

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
      }),

      prisma.vitalSign.findMany({
        where: { patientId },
      }),

      prisma.medication.findMany({
        where: { patientId },
      }),

      prisma.patientDocument.findMany({
        where: { patientId },
      }),

      prisma.appointment.findMany({
        where: { patientId },
      }),

      prisma.nutritionalAssessment.findMany({
        where: { patientId },
      }),
    ]);

    const timeline = [
      ...evolutions.map((item) => ({
        tipo: "EVOLUTION",
        data: item.createdAt,
        descricao: item.descricao,
      })),

      ...vitalSigns.map((item) => ({
        tipo: "VITAL_SIGN",
        data: item.createdAt,
        descricao:
          `PA ${item.pressaoSistolica}/${item.pressaoDiastolica} mmHg | ` +
          `Temp ${item.temperatura}°C` +
          `${item.saturacao ? ` | Sat ${item.saturacao}%` : ""}` +
          `${item.frequenciaCardiaca ? ` | FC ${item.frequenciaCardiaca} bpm` : ""}` +
          `${item.glicemia ? ` | Glicemia ${item.glicemia} mg/dL` : ""}`,
      })),

      ...medications.map((item) => ({
        tipo: "MEDICATION",
        data: item.createdAt,
        descricao: `${item.nome} - ${item.dosagem}`,
      })),

      ...documents.map((item) => ({
        tipo: "DOCUMENT",
        data: item.createdAt,
        descricao: `${item.tipo} - ${item.nome}`,
      })),

      ...appointments.map((item) => ({
        tipo: "APPOINTMENT",
        data: item.createdAt,
        descricao: `${item.titulo} (${item.status})`,
      })),

      ...nutritionalAssessments.map((item) => ({
        tipo: "NUTRITIONAL_ASSESSMENT",
        data: item.createdAt,
        descricao:
          `Peso: ${item.peso} kg | ` +
          `Altura: ${item.altura} m` +
          `${item.imc ? ` | IMC: ${item.imc.toFixed(1)}` : ""}`,
      })),
    ];

    timeline.sort(
      (a, b) =>
        new Date(b.data).getTime() -
        new Date(a.data).getTime()
    );

    return response.json(timeline);
  }
}