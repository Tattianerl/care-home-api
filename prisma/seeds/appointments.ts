import {
  AppointmentStatus,
  PrismaClient,
} from "@prisma/client";

const PATIENT_IDS = {
  ANTONIO: "22222222-2222-4222-8222-222222222001",
  MARIA: "22222222-2222-4222-8222-222222222002",
  GERALDO: "22222222-2222-4222-8222-222222222003",
  FRANCISCA: "22222222-2222-4222-8222-222222222004",
};

const USER_IDS = {
  MEDICO: "11111111-1111-4111-8111-111111111003",
  FISIOTERAPEUTA: "11111111-1111-4111-8111-111111111006",
  NUTRICIONISTA: "11111111-1111-4111-8111-111111111007",
  PSICOLOGO: "11111111-1111-4111-8111-111111111009",
  FONOAUDIOLOGO: "11111111-1111-4111-8111-111111111010",
};

export async function seedAppointments(prisma: PrismaClient) {
  await prisma.appointment.createMany({
    data: [
      {
        id: "55555555-5555-4555-8555-555555555001",
        titulo: "Consulta Clínica Geral",
        dataHora: new Date("2026-08-06T09:00:00"),
        local: "Consultório 01",
        status: AppointmentStatus.AGENDADO,
        observacoes:
          "Retorno para avaliação clínica e ajuste medicamentoso.",
        patientId: PATIENT_IDS.ANTONIO,
        userId: USER_IDS.MEDICO,
        createdAt: new Date("2026-08-01T08:00:00"),
      },

      {
        id: "55555555-5555-4555-8555-555555555002",
        titulo: "Sessão de Fisioterapia",
        dataHora: new Date("2026-08-06T14:00:00"),
        local: "Sala de Fisioterapia",
        status: AppointmentStatus.AGENDADO,
        observacoes:
          "Treino de marcha e fortalecimento muscular.",
        patientId: PATIENT_IDS.MARIA,
        userId: USER_IDS.FISIOTERAPEUTA,
        createdAt: new Date("2026-08-01T08:15:00"),
      },

      {
        id: "55555555-5555-4555-8555-555555555003",
        titulo: "Avaliação Nutricional",
        dataHora: new Date("2026-08-07T10:00:00"),
        local: "Consultório Nutrição",
        status: AppointmentStatus.AGENDADO,
        observacoes:
          "Revisão da dieta e avaliação antropométrica.",
        patientId: PATIENT_IDS.GERALDO,
        userId: USER_IDS.NUTRICIONISTA,
        createdAt: new Date("2026-08-01T08:30:00"),
      },

      {
        id: "55555555-5555-4555-8555-555555555004",
        titulo: "Consulta Médica Cardiologia",
        dataHora: new Date("2026-07-28T15:00:00"),
        local: "Consultório 02",
        status: AppointmentStatus.REALIZADO,
        observacoes:
          "Consulta realizada sem intercorrências.",
        patientId: PATIENT_IDS.FRANCISCA,
        userId: USER_IDS.MEDICO,
        createdAt: new Date("2026-07-25T09:00:00"),
      },

      {
        id: "55555555-5555-4555-8555-555555555005",
        titulo: "Atendimento Psicológico",
        dataHora: new Date("2026-07-30T11:00:00"),
        local: "Sala Psicologia",
        status: AppointmentStatus.CANCELADO,
        observacoes:
          "Cancelado por indisponibilidade do paciente.",
        patientId: PATIENT_IDS.MARIA,
        userId: USER_IDS.PSICOLOGO,
        createdAt: new Date("2026-07-25T09:30:00"),
      },

      {
        id: "55555555-5555-4555-8555-555555555006",
        titulo: "Avaliação Fonoaudiológica",
        dataHora: new Date("2026-08-08T13:30:00"),
        local: "Sala Fonoaudiologia",
        status: AppointmentStatus.AGENDADO,
        observacoes:
          "Avaliação de disfagia e comunicação.",
        patientId: PATIENT_IDS.FRANCISCA,
        userId: USER_IDS.FONOAUDIOLOGO,
        createdAt: new Date("2026-08-02T09:00:00"),
      },
    ],

    skipDuplicates: true,
  });

  console.log("✅ Agendamentos criados com sucesso.");
}