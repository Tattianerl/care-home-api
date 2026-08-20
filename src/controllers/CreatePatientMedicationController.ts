import { Request, Response } from "express";
import { MedicationStatus, UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";

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
  if (value === undefined || value === null) {
    return { value: null };
  }

  if (typeof value !== "string" || !datePattern.test(value)) {
    return { error: `${fieldName} deve estar no formato YYYY-MM-DD.` };
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return { error: `${fieldName} deve ser uma data valida.` };
  }

  return { value: date };
}

export class CreatePatientMedicationController {
  async handle(request: Request, response: Response) {
    const patientId = request.params.id as string;
    const userId = request.user?.id;
    const requestBody: unknown = request.body;

    if (!isMedicationRequestBody(requestBody)) {
      return response.status(400).json({
        error: "Dados da medicacao invalidos.",
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
        error: "Nome, dosagem e frequência são campos obrigatórios.",
      });
    }

    let medicationSchedules: string[] | undefined;

    if (horarios !== undefined && horarios !== null) {
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

      medicationSchedules = horarios;
    }

    const parsedInicioTratamento = parseMedicationDate(
      inicioTratamento,
      "Inicio do tratamento",
    );
    const parsedFimTratamento = parseMedicationDate(
      fimTratamento,
      "Fim do tratamento",
    );

    if ("error" in parsedInicioTratamento) {
      return response.status(400).json(parsedInicioTratamento);
    }

    if ("error" in parsedFimTratamento) {
      return response.status(400).json(parsedFimTratamento);
    }

    if (
      parsedInicioTratamento.value &&
      parsedFimTratamento.value &&
      parsedFimTratamento.value < parsedInicioTratamento.value
    ) {
      return response.status(400).json({
        error: "Fim do tratamento nao pode ser anterior ao inicio do tratamento.",
      });
    }

    let medicationStatus: MedicationStatus | undefined;

    if (status !== undefined) {
      if (!isMedicationStatus(status)) {
        return response.status(400).json({
          error: "Status de medicacao invalido.",
        });
      }

      medicationStatus = status;
    }

    let isControlled: boolean | undefined;

    if (controlado !== undefined) {
      if (typeof controlado !== "boolean") {
        return response.status(400).json({
          error: "Controlado deve ser um valor booleano.",
        });
      }

      isControlled = controlado;
    }

    let isContinuousUse: boolean | undefined;

    if (usoContinuo !== undefined) {
      if (typeof usoContinuo !== "boolean") {
        return response.status(400).json({
          error: "Uso continuo deve ser um valor booleano.",
        });
      }

      isContinuousUse = usoContinuo;
    }

    let medicationNotes: string | null | undefined;

    if (observacoes !== undefined) {
      if (observacoes !== null && typeof observacoes !== "string") {
        return response.status(400).json({
          error: "Observacoes deve ser uma string ou nulo.",
        });
      }

      medicationNotes = observacoes;
    }

    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patientExists) {
      return response.status(404).json({
        error: "Paciente não encontrado",
      });
    }

    let prescritorId: string | null = null;

    if (prescritoPorId !== undefined && prescritoPorId !== null) {
      if (!isNonEmptyString(prescritoPorId)) {
        return response.status(400).json({
          error: "Prescritor invalido.",
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

      prescritorId = prescritoPorId;
    }

    const medication = await prisma.medication.create({
      data: {
        nome,
        dosagem,
        frequencia,
        viaAdministracao,
        horarios: medicationSchedules,
        inicioTratamento: parsedInicioTratamento.value,
        fimTratamento: parsedFimTratamento.value,
        status: medicationStatus,
        controlado: isControlled,
        usoContinuo: isContinuousUse,
        observacoes: medicationNotes,
        prescritoPorId: prescritorId,
        patientId,
        userId: userId as string,
      },
    });

    await createAuditLog({
      userId: request.user!.id,
      acao: AuditActions.CREATE,
      entidade: "MEDICATION",
      entidadeId: medication.id,
      descricao: `Medicamento ${medication.nome} cadastrado para o paciente ${patientExists.nome}`,
    });

    return response.status(201).json(medication);
  }
}
