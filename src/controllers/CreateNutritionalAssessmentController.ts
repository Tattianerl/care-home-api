import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class CreateNutritionalAssessmentController {
  async handle(request: Request, response: Response) {
    try {
      const { peso, altura, observacoes, patientId } = request.body;
      const userId = request.user?.id;

      if (!userId) {
        return response.status(401).json({
          error: "Usuário não autenticado",
        });
      }

      // Validação de campos obrigatórios
      if (!patientId || peso === undefined || altura === undefined) {
        return response.status(400).json({
          error: "PatientId, peso e altura são obrigatórios.",
        });
      }

      // Converte para Number garantindo tipos válidos
      const numPeso = Number(peso);
      let numAltura = Number(altura);

      if (isNaN(numPeso) || isNaN(numAltura) || numPeso <= 0 || numAltura <= 0) {
        return response.status(400).json({
          error: "Peso e altura devem ser valores numéricos maiores que zero.",
        });
      }

      // Correção automática: Se a altura for enviada em cm (ex: 170 ao invés de 1.70)
      if (numAltura > 3) {
        numAltura = numAltura / 100;
      }

      // Verificação de existência do paciente
      const patientExists = await prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patientExists) {
        return response.status(404).json({
          error: "Paciente não encontrado",
        });
      }

      // Cálculo do IMC
      const imc = Number((numPeso / (numAltura * numAltura)).toFixed(2));

      // Salva no banco de dados
      const assessment = await prisma.nutritionalAssessment.create({
        data: {
          peso: numPeso,
          altura: numAltura,
          imc,
          observacoes: observacoes?.trim() || null,
          patientId,
          userId,
        },
        include: {
          user: {
            select: {
              nome: true,
              cargo: true,
            },
          },
        },
      });

      return response.status(201).json(assessment);
    } catch (error) {
      console.error("Erro ao criar avaliação nutricional:", error);
      return response.status(500).json({
        error: "Erro interno do servidor ao criar avaliação nutricional",
      });
    }
  }
}