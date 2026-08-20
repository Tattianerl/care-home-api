import { MedicationStatus, Prisma, UserRole } from "@prisma/client";
import { Request, Response } from "express";
import { AuditActions } from "../constants/auditActions";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";

type MedicationRequestBody = Record<string, unknown>;

type ParsedMedicationDate =
  | { value: Date | null }
  | { error: string };

const allowedMedicationFields = new Set([
  "nome",
  "dosagem",
  "frequencia",
  "viaAdministracao",
  "horarios",
  "inicioTratamento",
  "fimTratamento",
  "status",
  "controlado",
  "usoContinuo",
  "observacoes",
  "prescritoPorId",
]);

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isMedicationRequestBody(
  value: unknown,
): value is MedicationRequestBody {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isMedicationStatus(value: unknown): value is MedicationStatus {
  return Object.values(MedicationStatus).some((status) => status === value);
}

function isScheduleArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && timePattern.test(item))
  );
}

function parseMedicationDate(
  value: unknown,
  fieldName: string,
): ParsedMedicationDate {
  if (value === null) {
    return { value: null };
  }

  if (typeof value !== "string" || !datePattern.test(value)) {
    return { error: `${fieldName} deve estar no formato YYYY-MM-DD.` };
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return { error: `${fieldName} deve ser uma data válida.` };
  }

  return { value: date };
}

export class UpdateMedicationController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id || Array.isArray(id) || !uuidPattern.test(id)) {
        return response.status(400).json({
          error: "ID da medicação inválido.",
        });
      }

      const existingMedication = await prisma.medication.findUnique({
        where: { id },
      });

      if (!existingMedication) {
        return response.status(404).json({
          error: "Medicação não encontrada.",
        });
      }

      const requestBody: unknown = request.body;

      if (!isMedicationRequestBody(requestBody)) {
        return response.status(400).json({
          error: "O corpo da requisicao contem campos nao permitidos.",
        });
      }

      const hasInvalidField = Object.keys(requestBody).some(
        (field) => !allowedMedicationFields.has(field),
      );

      if (hasInvalidField) {
        return response.status(400).json({
          error: "O corpo da requisicao contem campos nao permitidos.",
        });
      }

      const {
        nome,
        dosagem,
        frequencia,
        viaAdministracao,
        horarios,
        inicioTratamento,
        fimTratamento,
        status,
        controlado,
        usoContinuo,
        observacoes,
        prescritoPorId,
      } = requestBody;

      if (
        !isNonEmptyString(nome) ||
        !isNonEmptyString(dosagem) ||
        !isNonEmptyString(frequencia) ||
        !isNonEmptyString(viaAdministracao)
      ) {
        return response.status(400).json({
          error: "Nome, dosagem, frequência e via de administração são campos obrigatórios.",
        });
      }

      const data: Prisma.MedicationUpdateInput = {
        nome,
        dosagem,
        frequencia,
        viaAdministracao,
      };

      if (Object.prototype.hasOwnProperty.call(requestBody, "horarios")) {
        if (horarios === null) {
          data.horarios = Prisma.DbNull;
        } else {
          if (!isScheduleArray(horarios)) {
            return response.status(400).json({
              error: "Horarios devem ser uma lista de valores no formato HH:mm.",
            });
          }

          if (new Set(horarios).size !== horarios.length) {
            return response.status(400).json({
              error: "Horarios nao podem conter valores duplicados.",
            });
          }

          data.horarios = horarios;
        }
      }

      let finalInicioTratamento = existingMedication.inicioTratamento;
      let finalFimTratamento = existingMedication.fimTratamento;

      if (Object.prototype.hasOwnProperty.call(requestBody, "inicioTratamento")) {
        const parsedInicioTratamento = parseMedicationDate(
          inicioTratamento,
          "Inicio do tratamento",
        );

        if ("error" in parsedInicioTratamento) {
          return response.status(400).json(parsedInicioTratamento);
        }

        finalInicioTratamento = parsedInicioTratamento.value;
        data.inicioTratamento = parsedInicioTratamento.value;
      }

      if (Object.prototype.hasOwnProperty.call(requestBody, "fimTratamento")) {
        const parsedFimTratamento = parseMedicationDate(
          fimTratamento,
          "Fim do tratamento",
        );

        if ("error" in parsedFimTratamento) {
          return response.status(400).json(parsedFimTratamento);
        }

        finalFimTratamento = parsedFimTratamento.value;
        data.fimTratamento = parsedFimTratamento.value;
      }

      if (
        finalInicioTratamento &&
        finalFimTratamento &&
        finalFimTratamento < finalInicioTratamento
      ) {
        return response.status(400).json({
          error: "Fim do tratamento nao pode ser anterior ao inicio do tratamento.",
        });
      }

      if (Object.prototype.hasOwnProperty.call(requestBody, "status")) {
        if (!isMedicationStatus(status)) {
          return response.status(400).json({
            error: "Status de medicacao invalido.",
          });
        }

        data.status = status;
      }

      if (Object.prototype.hasOwnProperty.call(requestBody, "controlado")) {
        if (typeof controlado !== "boolean") {
          return response.status(400).json({
            error: "Controlado deve ser um valor booleano.",
          });
        }

        data.controlado = controlado;
      }

      if (Object.prototype.hasOwnProperty.call(requestBody, "usoContinuo")) {
        if (typeof usoContinuo !== "boolean") {
          return response.status(400).json({
            error: "Uso continuo deve ser um valor booleano.",
          });
        }

        data.usoContinuo = usoContinuo;
      }

      if (Object.prototype.hasOwnProperty.call(requestBody, "observacoes")) {
        if (observacoes !== null && typeof observacoes !== "string") {
          return response.status(400).json({
            error: "Observacoes deve ser uma string ou nulo.",
          });
        }

        data.observacoes = observacoes;
      }

      if (Object.prototype.hasOwnProperty.call(requestBody, "prescritoPorId")) {
        if (prescritoPorId === null) {
          data.prescritoPor = { disconnect: true };
        } else {
          if (
            !isNonEmptyString(prescritoPorId) ||
            !uuidPattern.test(prescritoPorId)
          ) {
            return response.status(400).json({
              error: "Prescritor inválido.",
            });
          }

          const prescritor = await prisma.user.findUnique({
            where: { id: prescritoPorId },
            select: { cargo: true },
          });

          if (!prescritor) {
            return response.status(404).json({
              error: "Usuario prescritor nao encontrado.",
            });
          }

          if (prescritor.cargo !== UserRole.MEDICO) {
            return response.status(403).json({
              error: "Apenas usuarios com cargo MEDICO podem ser definidos como prescritores.",
            });
          }

          data.prescritoPor = { connect: { id: prescritoPorId } };
        }
      }

      const medication = await prisma.medication.update({
        where: { id },
        data,
        include: {
          patient: {
            select: {
              id: true,
              nome: true,
            },
          },
          user: {
            select: {
              id: true,
              nome: true,
              cargo: true,
            },
          },
          prescritoPor: {
            select: {
              id: true,
              nome: true,
              cargo: true,
            },
          },
        },
      });

      await createAuditLog({
        userId: request.user!.id,
        acao: AuditActions.UPDATE,
        entidade: "MEDICATION",
        entidadeId: medication.id,
        descricao: `Medicamento ${medication.nome} atualizado para o paciente ${medication.patient.nome}`,
      });

      return response.status(200).json(medication);
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        error: "Erro ao atualizar medicação.",
      });
    }
  }
}
