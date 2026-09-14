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
    request: Request<{ id: string }, unknown, UpdateVitalSignBody>,
    response: Response,
  ) {
    const vitalSignId = request.params.id;
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: "Usuário não autenticado." });
    }
    if (!vitalSignId) {
      return response
        .status(400)
        .json({ error: "ID do sinal vital é obrigatório." });
    }
    try {
      const existing = await prisma.vitalSign.findUnique({
        where: { id: vitalSignId },
        include: { patient: { select: { id: true, nome: true } } },
      });
      if (!existing) {
        return response
          .status(404)
          .json({ error: "Sinal vital não encontrado." });
      }
      /* * REGRA DE NEGÓCIO: * somente o profissional que criou o registro * pode editá-lo. * * existing.userId vem do banco. * userId vem do usuário autenticado. */ if (
        existing.userId !== userId
      ) {
        return response
          .status(403)
          .json({
            error:
              "Apenas o profissional que registrou este sinal vital pode editá-lo.",
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
      /* * Converte somente os campos enviados. * Campos não enviados mantêm o valor atual. */ const finalPressaoSistolica =
        pressaoSistolica !== undefined && pressaoSistolica !== null
          ? Number(pressaoSistolica)
          : existing.pressaoSistolica;
      const finalPressaoDiastolica =
        pressaoDiastolica !== undefined && pressaoDiastolica !== null
          ? Number(pressaoDiastolica)
          : existing.pressaoDiastolica;
      const finalTemperatura =
        temperatura !== undefined && temperatura !== null
          ? Number(temperatura)
          : existing.temperatura;
      const finalFrequenciaCardiaca =
        frequenciaCardiaca !== undefined
          ? frequenciaCardiaca === null
            ? null
            : Number(frequenciaCardiaca)
          : existing.frequenciaCardiaca;
      const finalFrequenciaRespiratoria =
        frequenciaRespiratoria !== undefined
          ? frequenciaRespiratoria === null
            ? null
            : Number(frequenciaRespiratoria)
          : existing.frequenciaRespiratoria;
      const finalSaturacao =
        saturacao !== undefined
          ? saturacao === null
            ? null
            : Number(saturacao)
          : existing.saturacao;
      const finalGlicemia =
        glicemia !== undefined
          ? glicemia === null
            ? null
            : Number(glicemia)
          : existing.glicemia;
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
      const finalDor =
        dor !== undefined ? (dor === null ? null : Number(dor)) : existing.dor;
      /* * Validação de números finitos. */ const numericValues: Array<
        [string, number | null]
      > = [
        ["pressao sistólica", finalPressaoSistolica],
        ["pressão diastólica", finalPressaoDiastolica],
        ["temperatura", finalTemperatura],
        ["frequência cardíaca", finalFrequenciaCardiaca],
        ["frequência respiratória", finalFrequenciaRespiratoria],
        ["saturação", finalSaturacao],
        ["glicemia", finalGlicemia],
        ["peso", finalPeso],
        ["altura", finalAltura],
        ["dor", finalDor],
      ];
      for (const [field, value] of numericValues) {
        if (value !== null && !Number.isFinite(value)) {
          return response
            .status(400)
            .json({ error: `Valor inválido para ${field}.` });
        }
      }
      /* * Validações clínicas e de domínio. * * Valores abaixo ou acima desses limites não representam * registros vitais plausíveis para este sistema. */ if (
        finalPressaoSistolica <= 0 ||
        finalPressaoSistolica > 300
      ) {
        return response
          .status(400)
          .json({ error: "Valor inválido para pressão sistólica." });
      }
      if (finalPressaoDiastolica <= 0 || finalPressaoDiastolica > 200) {
        return response
          .status(400)
          .json({ error: "Valor inválido para pressão diastólica." });
      }
      if (finalTemperatura < 25 || finalTemperatura > 45) {
        return response
          .status(400)
          .json({ error: "Valor inválido para temperatura." });
      }
      if (
        finalFrequenciaCardiaca !== null &&
        (finalFrequenciaCardiaca <= 0 || finalFrequenciaCardiaca > 300)
      ) {
        return response
          .status(400)
          .json({ error: "Valor inválido para frequência cardíaca." });
      }
      if (
        finalFrequenciaRespiratoria !== null &&
        (finalFrequenciaRespiratoria <= 0 || finalFrequenciaRespiratoria > 100)
      ) {
        return response
          .status(400)
          .json({ error: "Valor inválido para frequência respiratória." });
      }
      if (
        finalSaturacao !== null &&
        (finalSaturacao < 0 || finalSaturacao > 100)
      ) {
        return response
          .status(400)
          .json({ error: "Valor inválido para saturação." });
      }
      if (finalGlicemia !== null && finalGlicemia < 0) {
        return response
          .status(400)
          .json({ error: "Valor inválido para glicemia." });
      }
      if (finalPeso !== null && finalPeso <= 0) {
        return response
          .status(400)
          .json({ error: "O peso deve ser maior que zero." });
      }
      if (finalAltura !== null && finalAltura <= 0) {
        return response
          .status(400)
          .json({ error: "A altura deve ser maior que zero." });
      }
      if (finalDor !== null && (finalDor < 0 || finalDor > 10)) {
        return response
          .status(400)
          .json({ error: "A dor deve estar entre 0 e 10." });
      }
      /* * Calcula novamente o IMC com os valores finais. * * O IMC é derivado de peso e altura e, portanto, * não deve ser recebido do frontend como fonte de verdade. */ let imc:
        | number
        | null = null;
      if (finalPeso !== null && finalAltura !== null && finalAltura > 0) {
        imc = Number((finalPeso / (finalAltura * finalAltura)).toFixed(2));
      }
      const vitalSign = await prisma.vitalSign.update({
        where: { id: vitalSignId },
        data: {
          pressaoSistolica: Math.round(finalPressaoSistolica),
          pressaoDiastolica: Math.round(finalPressaoDiastolica),
          temperatura: finalTemperatura,
          frequenciaCardiaca:
            finalFrequenciaCardiaca !== null
              ? Math.round(finalFrequenciaCardiaca)
              : null,
          frequenciaRespiratoria:
            finalFrequenciaRespiratoria !== null
              ? Math.round(finalFrequenciaRespiratoria)
              : null,
          saturacao:
            finalSaturacao !== null ? Math.round(finalSaturacao) : null,
          glicemia: finalGlicemia,
          peso: finalPeso,
          altura: finalAltura,
          imc,
          dor: finalDor !== null ? Math.round(finalDor) : null,
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
        descricao:
          `Sinais vitais do paciente "${existing.patient.nome}" ` +
          `foram atualizados pelo profissional responsável pelo registro.`,
      });
      return response.json({
        ...vitalSign,
        pressao: `${vitalSign.pressaoSistolica}/${vitalSign.pressaoDiastolica}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar sinal vital:", error);
      return response
        .status(500)
        .json({ error: "Erro interno ao atualizar sinal vital." });
    }
  }
}
