import {
  AppointmentStatus,
  PrismaClient,
} from "@prisma/client";

export async function seedAppointments(prisma: PrismaClient) {
  await prisma.appointment.createMany({
    data: [
      {
        id: "appt-001",

        titulo: "Consulta Clínica Geral",

        dataHora: new Date("2026-08-06T09:00:00"),

        local: "Consultório 01",

        status: AppointmentStatus.AGENDADO,

        observacoes:
          "Retorno para avaliação clínica e ajuste medicamentoso.",

        patientId: "pat-001",
        userId: "usr-doctor-003",

        createdAt: new Date("2026-08-01T08:00:00"),
      },

      {
        id: "appt-002",

        titulo: "Sessão de Fisioterapia",

        dataHora: new Date("2026-08-06T14:00:00"),

        local: "Sala de Fisioterapia",

        status: AppointmentStatus.AGENDADO,

        observacoes:
          "Treino de marcha e fortalecimento muscular.",

        patientId: "pat-002",
        userId: "usr-physio-006",

        createdAt: new Date("2026-08-01T08:15:00"),
      },

      {
        id: "appt-003",

        titulo: "Avaliação Nutricional",

        dataHora: new Date("2026-08-07T10:00:00"),

        local: "Consultório Nutrição",

        status: AppointmentStatus.AGENDADO,

        observacoes:
          "Revisão da dieta e avaliação antropométrica.",

        patientId: "pat-003",
        userId: "usr-nutri-007",

        createdAt: new Date("2026-08-01T08:30:00"),
      },

      {
        id: "appt-004",

        titulo: "Consulta Médica Cardiologia",

        dataHora: new Date("2026-07-28T15:00:00"),

        local: "Consultório 02",

        status: AppointmentStatus.REALIZADO,

        observacoes:
          "Consulta realizada sem intercorrências.",

        patientId: "pat-004",
        userId: "usr-doctor-003",

        createdAt: new Date("2026-07-25T09:00:00"),
      },

      {
        id: "appt-005",

        titulo: "Atendimento Psicológico",

        dataHora: new Date("2026-07-30T11:00:00"),

        local: "Sala Psicologia",

        status: AppointmentStatus.CANCELADO,

        observacoes:
          "Cancelado por indisponibilidade do paciente.",

        patientId: "pat-002",
        userId: "usr-psico-009",

        createdAt: new Date("2026-07-25T09:30:00"),
      },

      {
        id: "appt-006",

        titulo: "Avaliação Fonoaudiológica",

        dataHora: new Date("2026-08-08T13:30:00"),

        local: "Sala Fonoaudiologia",

        status: AppointmentStatus.AGENDADO,

        observacoes:
          "Avaliação de disfagia e comunicação.",

        patientId: "pat-004",
        userId: "usr-fono-010",

        createdAt: new Date("2026-08-02T09:00:00"),
      },
    ],

    skipDuplicates: true,
  });

  console.log("✅ Agendamentos criados com sucesso.");
}