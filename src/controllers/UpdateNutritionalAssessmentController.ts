import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class UpdateNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    try {
      const assessmentId = String(request.params.id);
      const { peso, altura, observacoes } = request.body;

      const assessmentExists = await prisma.nutritionalAssessment.findUnique({
        where: { id: assessmentId },
      });

      if (!assessmentExists) {
        return response.status(404).json({
          error: "Avaliação nutricional não encontrada.",
        });
      }

      let dataToUpdate: any = { observacoes };

      // Se atualizar peso ou altura, recalcula o IMC
      if (peso || altura) {
        const newPeso = peso ? Number(peso) : assessmentExists.peso;
        let newAltura = altura ? Number(altura) : assessmentExists.altura;

        if (newAltura > 3) newAltura = newAltura / 100;

        const imc = Number((newPeso / (newAltura * newAltura)).toFixed(2));

        dataToUpdate = {
          ...dataToUpdate,
          peso: newPeso,
          altura: newAltura,
          imc,
        };
      }

      const updatedAssessment = await prisma.nutritionalAssessment.update({
        where: { id: assessmentId },
        data: dataToUpdate,
        include: {
          user: {
            select: {
              nome: true,
              cargo: true,
            },
          },
        },
      });

      return response.json(updatedAssessment);
    } catch (error) {
      console.error("Erro ao atualizar avaliação nutricional:", error);
      return response.status(500).json({
        error: "Erro ao atualizar avaliação nutricional",
      });
    }
  }
}