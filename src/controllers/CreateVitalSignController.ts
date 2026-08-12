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
    const patientId = request.params.id;
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    if (!patientId) {
      return response.status(400).json({
        error: "Paciente não informado",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
        nome: true,
      },
    });

    if (!patient) {
      return response.status(404).json({
        error: "Paciente não encontrado",
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

    const pesoNumber =
      peso != null ? Number(peso) : null;

    const alturaNumber =
      altura != null ? Number(altura) : null;

    let imc: number | null = null;

    if (
      pesoNumber !== null &&
      alturaNumber !== null &&
      Number.isFinite(pesoNumber) &&
      Number.isFinite(alturaNumber) &&
      alturaNumber > 0
    ) {
      imc = Number(
        (pesoNumber / (alturaNumber * alturaNumber)).toFixed(2)
      );
    }

    const vitalSign = await prisma.vitalSign.create({
      data: {
        pressaoSistolica: Math.round(sistolica),
        pressaoDiastolica: Math.round(diastolica),
        temperatura: temp,

        frequenciaCardiaca:
          frequenciaCardiaca != null
            ? Math.round(Number(frequenciaCardiaca))
            : null,

        frequenciaRespiratoria:
          frequenciaRespiratoria != null
            ? Math.round(Number(frequenciaRespiratoria))
            : null,

        saturacao:
          saturacao != null
            ? Math.round(Number(saturacao))
            : null,

        glicemia:
          glicemia != null
            ? Number(glicemia)
            : null,

        peso: pesoNumber,
        altura: alturaNumber,
        imc,

        dor:
          dor != null
            ? Math.round(Number(dor))
            : null,

        observacoes:
          observacoes?.trim() || null,

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
      descricao: `Sinais vitais registrados para o paciente ${patient.nome}`,
    });

    return response.status(201).json({
      ...vitalSign,
      pressao: `${vitalSign.pressaoSistolica}/${vitalSign.pressaoDiastolica}`,
    });
  }
}