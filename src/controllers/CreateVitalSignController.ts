import { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

interface CreateVitalSignBody {
  pressaoSistolica: number | string;
  pressaoDiastolica: number | string;
  temperatura: number | string;

  frequenciaCardiaca?: number | string | null;
  frequenciaRespiratoria?: number | string | null;
  saturacao?: number | string | null;
  glicemia?: number | string | null;

  peso?: number | string | null;
  altura?: number | string | null;

  dor?: number | string | null;
  observacoes?: string | null;
}

export class CreateVitalSignController {
  async handle(
    request: Request<
      { id: string },
      unknown,
      CreateVitalSignBody
    >,
    response: Response
  ) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const patientId = String(
        request.params.id ?? ""
      ).trim();

      if (!patientId) {
        return response.status(400).json({
          error: "ID do paciente é obrigatório.",
        });
      }

      const patient = await prisma.patient.findUnique({
        where: {
          id: patientId,
        },
        select: {
          id: true,
          nome: true,
          ativo: true,
        },
      });

      if (!patient) {
        return response.status(404).json({
          error: "Paciente não encontrado.",
        });
      }

      if (!patient.ativo) {
        return response.status(409).json({
          error:
            "Não é possível registrar sinais vitais para um paciente inativo.",
        });
      }

      const {
        pressaoSistolica,
        pressaoDiastolica,
        temperatura,
        frequenciaCardiaca,
        frequenciaRespiratoria,
        saturacao,
        glicemia,
        peso,
        altura,
        dor,
        observacoes,
      } = request.body;

      if (
        pressaoSistolica === undefined ||
        pressaoDiastolica === undefined ||
        temperatura === undefined
      ) {
        return response.status(400).json({
          error:
            "Pressão sistólica, pressão diastólica e temperatura são obrigatórias.",
        });
      }

      const sistolica = Number(pressaoSistolica);
      const diastolica = Number(pressaoDiastolica);
      const temp = Number(temperatura);

      if (
        !Number.isFinite(sistolica) ||
        !Number.isFinite(diastolica) ||
        !Number.isFinite(temp)
      ) {
        return response.status(400).json({
          error: "Valores dos sinais vitais inválidos.",
        });
      }

      if (sistolica <= 0 || diastolica <= 0) {
        return response.status(400).json({
          error: "Os valores da pressão arterial devem ser maiores que zero.",
        });
      }

      if (temp <= 0) {
        return response.status(400).json({
          error: "A temperatura deve ser maior que zero.",
        });
      }

      const parseOptionalNumber = (
        value: number | string | null | undefined
      ): number | null => {
        if (value === undefined || value === null || value === "") {
          return null;
        }

        const parsed = Number(value);

        return Number.isFinite(parsed) ? parsed : null;
      };

      const frequenciaCardiacaNumber =
        parseOptionalNumber(frequenciaCardiaca);

      const frequenciaRespiratoriaNumber =
        parseOptionalNumber(frequenciaRespiratoria);

      const saturacaoNumber =
        parseOptionalNumber(saturacao);

      const glicemiaNumber =
        parseOptionalNumber(glicemia);

      const pesoNumber =
        parseOptionalNumber(peso);

      const alturaNumber =
        parseOptionalNumber(altura);

      const dorNumber =
        parseOptionalNumber(dor);

      if (
        frequenciaCardiaca !== undefined &&
        frequenciaCardiaca !== null &&
        frequenciaCardiacaNumber === null
      ) {
        return response.status(400).json({
          error: "Frequência cardíaca inválida.",
        });
      }

      if (
        frequenciaRespiratoria !== undefined &&
        frequenciaRespiratoria !== null &&
        frequenciaRespiratoriaNumber === null
      ) {
        return response.status(400).json({
          error: "Frequência respiratória inválida.",
        });
      }

      if (
        saturacao !== undefined &&
        saturacao !== null &&
        saturacaoNumber === null
      ) {
        return response.status(400).json({
          error: "Saturação inválida.",
        });
      }

      if (
        glicemia !== undefined &&
        glicemia !== null &&
        glicemiaNumber === null
      ) {
        return response.status(400).json({
          error: "Glicemia inválida.",
        });
      }

      if (
        peso !== undefined &&
        peso !== null &&
        pesoNumber === null
      ) {
        return response.status(400).json({
          error: "Peso inválido.",
        });
      }

      if (
        altura !== undefined &&
        altura !== null &&
        alturaNumber === null
      ) {
        return response.status(400).json({
          error: "Altura inválida.",
        });
      }

      if (
        dor !== undefined &&
        dor !== null &&
        dorNumber === null
      ) {
        return response.status(400).json({
          error: "Escala de dor inválida.",
        });
      }

      if (
        frequenciaCardiacaNumber !== null &&
        frequenciaCardiacaNumber <= 0
      ) {
        return response.status(400).json({
          error: "A frequência cardíaca deve ser maior que zero.",
        });
      }

      if (
        frequenciaRespiratoriaNumber !== null &&
        frequenciaRespiratoriaNumber <= 0
      ) {
        return response.status(400).json({
          error:
            "A frequência respiratória deve ser maior que zero.",
        });
      }

      if (
        saturacaoNumber !== null &&
        (saturacaoNumber < 0 || saturacaoNumber > 100)
      ) {
        return response.status(400).json({
          error: "A saturação deve estar entre 0 e 100.",
        });
      }

      if (
        glicemiaNumber !== null &&
        glicemiaNumber < 0
      ) {
        return response.status(400).json({
          error: "A glicemia não pode ser negativa.",
        });
      }

      if (
        pesoNumber !== null &&
        pesoNumber <= 0
      ) {
        return response.status(400).json({
          error: "O peso deve ser maior que zero.",
        });
      }

      if (
        alturaNumber !== null &&
        alturaNumber <= 0
      ) {
        return response.status(400).json({
          error: "A altura deve ser maior que zero.",
        });
      }

      if (
        dorNumber !== null &&
        (dorNumber < 0 || dorNumber > 10)
      ) {
        return response.status(400).json({
          error: "A escala de dor deve estar entre 0 e 10.",
        });
      }

      let imc: number | null = null;

      if (
        pesoNumber !== null &&
        alturaNumber !== null
      ) {
        imc = Number(
          (
            pesoNumber /
            (alturaNumber * alturaNumber)
          ).toFixed(2)
        );
      }

      if (
        observacoes !== undefined &&
        observacoes !== null &&
        typeof observacoes !== "string"
      ) {
        return response.status(400).json({
          error: "Observações inválidas.",
        });
      }

      const vitalSign = await prisma.vitalSign.create({
        data: {
          pressaoSistolica: Math.round(sistolica),
          pressaoDiastolica: Math.round(diastolica),
          temperatura: temp,

          frequenciaCardiaca:
            frequenciaCardiacaNumber !== null
              ? Math.round(frequenciaCardiacaNumber)
              : null,

          frequenciaRespiratoria:
            frequenciaRespiratoriaNumber !== null
              ? Math.round(frequenciaRespiratoriaNumber)
              : null,

          saturacao:
            saturacaoNumber !== null
              ? Math.round(saturacaoNumber)
              : null,

          glicemia:
            glicemiaNumber !== null
              ? glicemiaNumber
              : null,

          peso: pesoNumber,
          altura: alturaNumber,
          imc,

          dor:
            dorNumber !== null
              ? Math.round(dorNumber)
              : null,

          observacoes:
            typeof observacoes === "string"
              ? observacoes.trim() || null
              : null,

          patient: {
            connect: {
              id: patientId,
            },
          },

          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await createAuditLog({
        userId,
        acao: AuditActions.CREATE,
        entidade: "VITAL_SIGN",
        entidadeId: vitalSign.id,
        descricao:
          `Sinais vitais registrados para o paciente ` +
          `"${patient.nome}".`,
      });

      return response.status(201).json({
        ...vitalSign,
        pressao:
          `${vitalSign.pressaoSistolica}/` +
          `${vitalSign.pressaoDiastolica}`,
      });
    } catch (error) {
      console.error(
        "Erro ao registrar sinais vitais:",
        error
      );

      return response.status(500).json({
        error: "Erro interno ao registrar sinais vitais.",
      });
    }
  }
}