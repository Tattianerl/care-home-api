import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DashboardController {
  async handle(request: Request, response: Response) {

    const [
      totalPatients,
      activePatients,
      inactivePatients,
      totalEvolutions,
      totalVitalSigns,
      totalMedications,
      totalDocuments,
      totalAppointments,
    ] = await Promise.all([

      prisma.patient.count(),

      prisma.patient.count({
        where: {
          ativo: true,
        },
      }),

      prisma.patient.count({
        where: {
          ativo: false,
        },
      }),

      prisma.evolution.count(),

      prisma.vitalSign.count(),

      prisma.medication.count(),

      prisma.patientDocument.count(),

      prisma.appointment.count(),
    ]);

    return response.status(200).json({
      patients: totalPatients,
      activePatients,
      inactivePatients,
      evolutions: totalEvolutions,
      vitalSigns: totalVitalSigns,
      medications: totalMedications,
      documents: totalDocuments,
      appointments: totalAppointments,
    });
  }
}