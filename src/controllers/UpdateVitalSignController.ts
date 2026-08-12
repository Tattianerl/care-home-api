import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

interface UpdateVitalSignBody {
  pressaoSistolica?: number | string | null;
  pressaoDiastolica?: number | string | null;
  temperatura?: number | string | null;

  frequenciaCardiaca?: number | string | null;
  frequenciaRespiratoria?: number | string | null;
  saturacao?: number | string | null;
  glicemia?: number | string | null;

  peso?: number | string | null;
  altura?: number | string | null;

  dor?: number | string | null;
  observacoes?: string | null;
}

export class UpdateVitalSignController {
  async handle(
    request: Request<
      { id: string },
      unknown,
      UpdateVitalSignBody
    >,
    response: Response
  ) {
    const vitalSignId = request.params.id;
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const existing = await prisma.vitalSign.findUnique({
      where: {
        id: vitalSignId,
      },
      include: {
        patient: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!existing) {
      return response.status(404).json({
        error: "Sinal vital não encontrado",
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

    const finalPeso =
      peso !== undefined
        ? peso === null
          ? null
          : Number(peso)
        : existing.peso;

    const finalAltura =
      altura !== undefined
        ? altura === null
          ? null
          : Number(altura)
        : existing.altura;

    let imc: number | null = null;

    if (
      finalPeso !== null &&
      finalAltura !== null &&
      Number.isFinite(finalPeso) &&
      Number.isFinite(finalAltura) &&
      finalAltura > 0
    ) {
      imc = Number(
        (
          finalPeso /
          (finalAltura * finalAltura)
        ).toFixed(2)
      );
    }

    const vitalSign = await prisma.vitalSign.update({
      where: {
        id: vitalSignId,
      },

      data: {
        pressaoSistolica:
          pressaoSistolica !== undefined
            ? pressaoSistolica === null
              ? existing.pressaoSistolica
              : Math.round(Number(pressaoSistolica))
            : existing.pressaoSistolica,

        pressaoDiastolica:
          pressaoDiastolica !== undefined
            ? pressaoDiastolica === null
              ? existing.pressaoDiastolica
              : Math.round(Number(pressaoDiastolica))
            : existing.pressaoDiastolica,

        temperatura:
          temperatura !== undefined
            ? temperatura === null
              ? existing.temperatura
              : Number(temperatura)
            : existing.temperatura,

        frequenciaCardiaca:
          frequenciaCardiaca !== undefined
            ? frequenciaCardiaca === null
              ? null
              : Math.round(Number(frequenciaCardiaca))
            : existing.frequenciaCardiaca,

        frequenciaRespiratoria:
          frequenciaRespiratoria !== undefined
            ? frequenciaRespiratoria === null
              ? null
              : Math.round(Number(frequenciaRespiratoria))
            : existing.frequenciaRespiratoria,

        saturacao:
          saturacao !== undefined
            ? saturacao === null
              ? null
              : Math.round(Number(saturacao))
            : existing.saturacao,

        glicemia:
          glicemia !== undefined
            ? glicemia === null
              ? null
              : Number(glicemia)
            : existing.glicemia,

        peso: finalPeso,
        altura: finalAltura,
        imc,

        dor:
          dor !== undefined
            ? dor === null
              ? null
              : Math.round(Number(dor))
            : existing.dor,

        observacoes:
          observacoes !== undefined
            ? observacoes?.trim() || null
            : existing.observacoes,
      },
    });

    await createAuditLog({
      userId,
      acao: AuditActions.UPDATE,
      entidade: "VITAL_SIGN",
      entidadeId: vitalSign.id,
      descricao: `Sinais vitais atualizados para o paciente ${existing.patient.nome}`,
    });

    return response.json({
      ...vitalSign,
      pressao: `${vitalSign.pressaoSistolica}/${vitalSign.pressaoDiastolica}`,
    });
  }
}