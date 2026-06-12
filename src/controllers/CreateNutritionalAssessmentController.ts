import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class CreateNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    const {
      peso,
      altura,
      observacoes,
      patientId,
    } = request.body;

    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const patientExists = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patientExists) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    const imc = Number(
      (peso / (altura * altura)).toFixed(2)
    );

    const assessment =
      await prisma.nutritionalAssessment.create({
        data: {
          peso,
          altura,
          imc,
          observacoes,
          patientId,
          userId,
        },
      });

    return response.status(201).json(assessment);
  }
}
