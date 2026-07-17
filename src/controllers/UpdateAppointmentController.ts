import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

import {
  createAuditLog,
} from "../services/audit/createAuditLog";

import {
  AuditActions,
} from "../constants/auditActions";


export class UpdateAppointmentController {

  async handle(
    request: Request,
    response: Response
  ) {

    const appointmentId =
      request.params.id as string;


    const {
      titulo,
      dataHora,
      observacoes,
    } = request.body;



    const userId =
      request.user?.id;



    if (!userId) {

      return response.status(401).json({
        error:
          "Usuário não autenticado.",
      });

    }



    if (!titulo || !dataHora) {

      return response.status(400).json({

        error:
          "Título e data/hora são obrigatórios.",

      });

    }



    const appointmentDate =
      new Date(dataHora);



    if (
      isNaN(
        appointmentDate.getTime()
      )
    ) {

      return response.status(400).json({

        error:
          "Data do agendamento inválida.",

      });

    }



    const appointment =
      await prisma.appointment.findUnique({

        where: {
          id: appointmentId,
        },


        include: {

          patient: {
            select: {
              nome: true,
            },
          },

        },

      });



    if (!appointment) {

      return response.status(404).json({

        error:
          "Agendamento não encontrado.",

      });

    }



    const updatedAppointment =
      await prisma.appointment.update({

        where: {
          id: appointmentId,
        },


        data: {

          titulo,

          dataHora:
            appointmentDate,

          observacoes,

        },

      });



    await createAuditLog({

      userId,

      acao:
        AuditActions.UPDATE,

      entidade:
        "APPOINTMENT",

      entidadeId:
        appointmentId,


      descricao:
        `Agendamento "${titulo}" do paciente "${appointment.patient.nome}" atualizado.`,

    });



    return response.json(
      updatedAppointment
    );

  }

}