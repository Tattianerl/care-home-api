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

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isMedicationRequestBody(
  value: unknown,
): value is MedicationRequestBody {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isMedicationStatus(
  value: unknown,
): value is MedicationStatus {
  return Object.values(MedicationStatus).some(
    (status) => status === value,
  );
}

function isScheduleArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string" &&
        timePattern.test(item),
    )
  );
}

function parseMedicationDate(
  value: unknown,
  fieldName: string,
): ParsedMedicationDate {
  if (value === null) {
    return { value: null };
  }

  if (
    typeof value !== "string" ||
    !datePattern.test(value)
  ) {
    return {
      error: `${fieldName} deve estar no formato YYYY-MM-DD.`,
    };
  }

  const date = new Date(
    `${value}T00:00:00.000Z`,
  );

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return {
      error: `${fieldName} deve ser uma data válida.`,
    };
  }

  return { value: date };
}

function formatAuditValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "vazio";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (Array.isArray(value)) {
    return value.join(", ") || "vazio";
  }

  return String(value);
}

export class UpdateMedicationController {
  async handle(
    request: Request,
    response: Response,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

    try {
      const { id } = request.params;

      if (!id || Array.isArray(id)) {
        return response.status(400).json({
          error: "ID da medicação inválido.",
        });
      }

      const existingMedication =
        await prisma.medication.findUnique({
          where: { id },
          include: {
            prescritoPor: {
              select: {
                id: true,
                nome: true,
                cargo: true,
              },
            },
          },
        });

      if (!existingMedication) {
        return response.status(404).json({
          error: "Medicação não encontrada.",
        });
      }

      const requestBody: unknown = request.body;

      if (!isMedicationRequestBody(requestBody)) {
        return response.status(400).json({
          error:
            "O corpo da requisição contém campos não permitidos.",
        });
      }

      const hasInvalidField = Object.keys(requestBody).some(
        (field) => !allowedMedicationFields.has(field),
      );

      if (hasInvalidField) {
        return response.status(400).json({
          error:
            "O corpo da requisição contém campos não permitidos.",
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
          error:
            "Nome, dosagem, frequência e via de administração são campos obrigatórios.",
        });
      }

      const data: Prisma.MedicationUpdateInput = {
        nome: nome.trim(),
        dosagem: dosagem.trim(),
        frequencia: frequencia.trim(),
        viaAdministracao: viaAdministracao.trim(),
      };

      const changes: string[] = [];

      if (
        existingMedication.nome !== nome.trim()
      ) {
        changes.push(
          `nome: "${existingMedication.nome}" → "${nome.trim()}"`,
        );
      }

      if (
        existingMedication.dosagem !== dosagem.trim()
      ) {
        changes.push(
          `dosagem: "${existingMedication.dosagem}" → "${dosagem.trim()}"`,
        );
      }

      if (
        existingMedication.frequencia !==
        frequencia.trim()
      ) {
        changes.push(
          `frequência: "${existingMedication.frequencia}" → "${frequencia.trim()}"`,
        );
      }

      if (
        existingMedication.viaAdministracao !==
        viaAdministracao.trim()
      ) {
        changes.push(
          `via de administração: "${existingMedication.viaAdministracao}" → "${viaAdministracao.trim()}"`,
        );
      }

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "horarios",
        )
      ) {
        if (horarios === null) {
          data.horarios = Prisma.DbNull;

          if (existingMedication.horarios !== null) {
            changes.push(
              `horários: "${formatAuditValue(existingMedication.horarios)}" → vazio`,
            );
          }
        } else {
          if (!isScheduleArray(horarios)) {
            return response.status(400).json({
              error:
                "Horários devem ser uma lista de valores no formato HH:mm.",
            });
          }

          if (
            new Set(horarios).size !== horarios.length
          ) {
            return response.status(400).json({
              error:
                "Horários não podem conter valores duplicados.",
            });
          }

          data.horarios = horarios;

          if (
            JSON.stringify(existingMedication.horarios ?? []) !==
            JSON.stringify(horarios)
          ) {
            changes.push(
              `horários: "${formatAuditValue(existingMedication.horarios)}" → "${formatAuditValue(horarios)}"`,
            );
          }
        }
      }

      let finalInicioTratamento =
        existingMedication.inicioTratamento;

      let finalFimTratamento =
        existingMedication.fimTratamento;

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "inicioTratamento",
        )
      ) {
        const parsedInicioTratamento =
          parseMedicationDate(
            inicioTratamento,
            "Início do tratamento",
          );

        if ("error" in parsedInicioTratamento) {
          return response
            .status(400)
            .json(parsedInicioTratamento);
        }

        finalInicioTratamento =
          parsedInicioTratamento.value;

        data.inicioTratamento =
          parsedInicioTratamento.value;

        if (
          formatAuditValue(
            existingMedication.inicioTratamento,
          ) !==
          formatAuditValue(
            parsedInicioTratamento.value,
          )
        ) {
          changes.push(
            `início do tratamento: "${formatAuditValue(existingMedication.inicioTratamento)}" → "${formatAuditValue(parsedInicioTratamento.value)}"`,
          );
        }
      }

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "fimTratamento",
        )
      ) {
        const parsedFimTratamento =
          parseMedicationDate(
            fimTratamento,
            "Fim do tratamento",
          );

        if ("error" in parsedFimTratamento) {
          return response
            .status(400)
            .json(parsedFimTratamento);
        }

        finalFimTratamento =
          parsedFimTratamento.value;

        data.fimTratamento =
          parsedFimTratamento.value;

        if (
          formatAuditValue(
            existingMedication.fimTratamento,
          ) !==
          formatAuditValue(
            parsedFimTratamento.value,
          )
        ) {
          changes.push(
            `fim do tratamento: "${formatAuditValue(existingMedication.fimTratamento)}" → "${formatAuditValue(parsedFimTratamento.value)}"`,
          );
        }
      }

      if (
        finalInicioTratamento &&
        finalFimTratamento &&
        finalFimTratamento < finalInicioTratamento
      ) {
        return response.status(400).json({
          error:
            "Fim do tratamento não pode ser anterior ao início do tratamento.",
        });
      }

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "status",
        )
      ) {
        if (!isMedicationStatus(status)) {
          return response.status(400).json({
            error: "Status de medicação inválido.",
          });
        }

        data.status = status;

        if (existingMedication.status !== status) {
          changes.push(
            `status: "${existingMedication.status}" → "${status}"`,
          );
        }
      }

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "controlado",
        )
      ) {
        if (typeof controlado !== "boolean") {
          return response.status(400).json({
            error:
              "Controlado deve ser um valor booleano.",
          });
        }

        data.controlado = controlado;

        if (
          existingMedication.controlado !==
          controlado
        ) {
          changes.push(
            `controlado: "${existingMedication.controlado}" → "${controlado}"`,
          );
        }
      }

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "usoContinuo",
        )
      ) {
        if (typeof usoContinuo !== "boolean") {
          return response.status(400).json({
            error:
              "Uso contínuo deve ser um valor booleano.",
          });
        }

        data.usoContinuo = usoContinuo;

        if (
          existingMedication.usoContinuo !==
          usoContinuo
        ) {
          changes.push(
            `uso contínuo: "${existingMedication.usoContinuo}" → "${usoContinuo}"`,
          );
        }
      }

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "observacoes",
        )
      ) {
        if (
          observacoes !== null &&
          typeof observacoes !== "string"
        ) {
          return response.status(400).json({
            error:
              "Observações deve ser uma string ou nulo.",
          });
        }

        const normalizedObservacoes =
          typeof observacoes === "string"
            ? observacoes.trim()
            : null;

        data.observacoes =
          normalizedObservacoes;

        if (
          existingMedication.observacoes !==
          normalizedObservacoes
        ) {
          changes.push(
            `observações: "${formatAuditValue(existingMedication.observacoes)}" → "${formatAuditValue(normalizedObservacoes)}"`,
          );
        }
      }

      if (
        Object.prototype.hasOwnProperty.call(
          requestBody,
          "prescritoPorId",
        )
      ) {
        if (prescritoPorId === null) {
          data.prescritoPor = {
            disconnect: true,
          };

          if (existingMedication.prescritoPor) {
            changes.push(
              `prescritor: "${existingMedication.prescritoPor.nome}" → vazio`,
            );
          }
        } else {
          if (
            !isNonEmptyString(prescritoPorId) ||
            !uuidPattern.test(prescritoPorId)
          ) {
            return response.status(400).json({
              error: "Prescritor inválido.",
            });
          }

          const prescritor =
            await prisma.user.findUnique({
              where: {
                id: prescritoPorId.trim(),
              },
              select: {
                id: true,
                nome: true,
                cargo: true,
              },
            });

          if (!prescritor) {
            return response.status(404).json({
              error:
                "Usuário prescritor não encontrado.",
            });
          }

          if (
            prescritor.cargo !== UserRole.MEDICO
          ) {
            return response.status(403).json({
              error:
                "Apenas usuários com cargo MEDICO podem ser definidos como prescritores.",
            });
          }

          data.prescritoPor = {
            connect: {
              id: prescritoPorId.trim(),
            },
          };

          if (
            existingMedication.prescritoPor?.id !==
            prescritor.id
          ) {
            changes.push(
              `prescritor: "${formatAuditValue(existingMedication.prescritoPor?.nome)}" → "${prescritor.nome}"`,
            );
          }
        }
      }

      const medication =
        await prisma.medication.update({
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

      if (changes.length > 0) {
        await createAuditLog({
          userId,
          acao: AuditActions.UPDATE,
          entidade: "MEDICATION",
          entidadeId: medication.id,
          descricao:
            `Medicamento "${medication.nome}" do paciente ` +
            `"${medication.patient.nome}" atualizado. ` +
            `Alterações: ${changes.join("; ")}.`,
        });
      }

      return response.status(200).json(medication);
    } catch (error) {
      console.error(
        "Erro ao atualizar medicação:",
        error,
      );

      return response.status(500).json({
        error: "Erro ao atualizar medicação.",
      });
    }
  }
}