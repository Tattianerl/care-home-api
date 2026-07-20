// appointments.ts
import { AppointmentStatus } from "@prisma/client";

export const appointmentsSeed = [
  {
    id: "app-001",
    titulo: "Consulta de Rotina - Geriatria",
    dataHora: new Date("2026-07-10T10:00:00Z"),
    status: AppointmentStatus.REALIZADO,
    observacoes: "Atendimento mensal presencial realizado pela Dra. Helena no consultório da ILPI.",
    patientId: "pat-001",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-01T09:00:00Z")
  },
  {
    id: "app-002",
    titulo: "Coleta de Exames Laboratoriais",
    dataHora: new Date("2026-07-15T07:00:00Z"),
    status: AppointmentStatus.REALIZADO,
    observacoes: "Hemograma completo, perfil lipídico e HbA1c. Laboratório móvel coletou na instituição.",
    patientId: "pat-001",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-10T11:00:00Z")
  },
  {
    id: "app-003",
    titulo: "Avaliação Cognitiva Anual",
    dataHora: new Date("2026-07-19T09:30:00Z"),
    status: AppointmentStatus.REALIZADO,
    observacoes: "Reavaliação dos scores de memória e aplicação do Mini-Mental.",
    patientId: "pat-002",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-05T14:00:00Z")
  },
  {
    id: "app-004",
    titulo: "Sessão Especial de Reabilitação Neurofuncional",
    dataHora: new Date("2026-07-21T14:00:00Z"),
    status: AppointmentStatus.AGENDADO,
    observacoes: "Treino intensivo de marcha em barras paralelas e descarga de peso.",
    patientId: "pat-003",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-18T16:00:00Z")
  },
  {
    id: "app-005",
    titulo: "Consulta Externa - Cardiologista",
    dataHora: new Date("2026-07-22T10:00:00Z"),
    status: AppointmentStatus.AGENDADO,
    observacoes: "Consulta de rotina no hospital de referência. Necessita de transporte institucional e acompanhante.",
    patientId: "pat-004",
    userId: "usr-nurse-002",
    createdAt: new Date("2026-07-13T11:30:00Z")
  },
  {
    id: "app-006",
    titulo: "Oficina Coletiva de Estimulação Motora",
    dataHora: new Date("2026-07-23T09:00:00Z"),
    status: AppointmentStatus.AGENDADO,
    observacoes: "Atividade em grupo focada em coordenação motora grossa e prevenção de quedas.",
    patientId: "pat-005",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-19T10:00:00Z")
  },
  {
    id: "app-007",
    titulo: "Consulta Externa - Oftalmologista",
    dataHora: new Date("2026-07-17T14:00:00Z"),
    status: AppointmentStatus.CANCELADO,
    observacoes: "Cancelado pela clínica externa devido à ausência do médico especialista. Reagendamento em andamento.",
    patientId: "pat-006",
    userId: "usr-social-004",
    createdAt: new Date("2026-07-01T10:00:00Z")
  },
  {
    id: "app-008",
    titulo: "Consulta Externa - Oftalmologista (Reagendada)",
    dataHora: new Date("2026-07-24T14:00:00Z"),
    status: AppointmentStatus.AGENDADO,
    observacoes: "Retorno reagendado para acompanhamento da pressão intraocular do Glaucoma.",
    patientId: "pat-006",
    userId: "usr-social-004",
    createdAt: new Date("2026-07-17T15:00:00Z")
  },
  {
    id: "app-009",
    titulo: "Espirometria / Prova de Função Pulmonar",
    dataHora: new Date("2026-07-27T08:30:00Z"),
    status: AppointmentStatus.AGENDADO,
    observacoes: "Exame externo para mapeamento do avanço da DPOC. Familiar ciente e fará o acompanhamento.",
    patientId: "pat-007",
    userId: "usr-doctor-001",
    createdAt: new Date("2026-07-18T11:00:00Z")
  },
  {
    id: "app-010",
    titulo: "Sessão Individual de Fisioterapia Analgésica",
    dataHora: new Date("2026-07-20T10:00:00Z"),
    status: AppointmentStatus.REALIZADO,
    observacoes: "Focada no alívio das dores articulares em joelhos antes das oficinas da tarde.",
    patientId: "pat-008",
    userId: "usr-physio-003",
    createdAt: new Date("2026-07-19T14:00:00Z")
  },
  {
    id: "app-011",
    titulo: "Reunião de Acolhimento Familiar",
    dataHora: new Date("2026-07-22T15:30:00Z"),
    status: AppointmentStatus.AGENDADO,
    observacoes: "Conversa com o responsável legal para alinhamento das atividades e evolução social dentro da casa.",
    patientId: "pat-002",
    userId: "usr-social-004",
    createdAt: new Date("2026-07-15T14:30:00Z")
  },
  {
    id: "app-012",
    titulo: "Avaliação do Estado Nutricional Geral",
    dataHora: new Date("2026-07-24T10:30:00Z"),
    status: AppointmentStatus.AGENDADO,
    observacoes: "Acompanhamento periódico de pesagem e ajuste antropométrico.",
    patientId: "pat-004",
    userId: "usr-nutri-005",
    createdAt: new Date("2026-07-15T11:00:00Z")
  }
];