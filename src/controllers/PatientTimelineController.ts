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
      ...evolutions.map(item => ({
        tipo: "EVOLUTION",
        data: item.createdAt,
        descricao: item.descricao,
      })),

      ...vitalSigns.map(item => ({
        tipo: "VITAL_SIGN",
        data: item.createdAt,
        descricao: `PA ${item.pressao} | Temp ${item.temperatura}°C`,
      })),

      ...medications.map(item => ({
        tipo: "MEDICATION",
        data: item.createdAt,
        descricao: `${item.nome} - ${item.dosagem}`,
      })),

      ...documents.map(item => ({
        tipo: "DOCUMENT",
        data: item.createdAt,
        descricao: item.nome,
      })),

      ...appointments.map(item => ({
        tipo: "APPOINTMENT",
        data: item.createdAt,
        descricao: item.titulo,
      })),

      ...nutritionalAssessments.map(item => ({
        tipo: "NUTRITIONAL_ASSESSMENT",
        data: item.createdAt,
        descricao: `Peso: ${item.peso}kg`,
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