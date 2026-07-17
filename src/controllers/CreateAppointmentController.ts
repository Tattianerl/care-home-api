import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createAuditLog } from "../services/audit/createAuditLog";
import { AuditActions } from "../constants/auditActions";


export class CreateAppointmentController {
  async handle(request: Request, response: Response) {
    const {
      titulo,
      dataHora,
      observacoes,
      patientId,
    } = request.body;

    if (!titulo || !dataHora || !patientId) {
      return response.status(400).json({
        error: "Título, data/hora e paciente são obrigatórios.",
      });
    }

    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    
    const appointmentDate = new Date(dataHora);

    if (isNaN(appointmentDate.getTime())) {
      return response.status(400).json({
        error: "Data do agendamento inválida.",
      });
    }

    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        ativo: true,
      },
    });
    if (!patient) {
      return response.status(404).json({
        error: "Paciente não encontrado ou está inativo.",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        titulo,
        dataHora: appointmentDate,
        observacoes,
        patientId,
        userId,
      },
    });

    
    await createAuditLog({
      userId,
      acao: AuditActions.CREATE,
      entidade: "APPOINTMENT",
      entidadeId: appointment.id,
      descricao:
        `Agendamento "${appointment.titulo}" criado para ${patient.nome} em ${appointmentDate.toLocaleString("pt-BR")}.`
    });

    return response.status(201).json(appointment);
  }
}
