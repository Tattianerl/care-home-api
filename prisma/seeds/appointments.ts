import { PrismaClient } from "@prisma/client";

export async function seedAppointments(prisma: PrismaClient) {
  await prisma.appointment.createMany({
    data: [
      {
        id: "app-001",
        titulo: "Consulta de Rotina - Geriatria",
        dataHora: new Date("2026-07-10T10:00:00Z"),
        observacoes: "Avaliação geral do quadro metabólico e ajuste de receitas.",
        status: "REALIZADO",
        patientId: "pat-001",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-10T10:10:00Z")
      },
      {
        id: "app-007",
        titulo: "Exame Externo - Oftalmologia",
        dataHora: new Date("2026-07-17T14:00:00Z"),
        observacoes: "Cancelado devido a indisponibilidade de transporte clínico especializado.",
        status: "CANCELADO",
        patientId: "pat-002",
        userId: "usr-social-004",
        createdAt: new Date("2026-07-17T14:05:00Z")
      },
      {
        id: "app-008",
        titulo: "Nova Sessão - Avaliação Cognitiva",
        dataHora: new Date("2026-07-25T15:00:00Z"),
        observacoes: "Agendamento remarcado para compensar a data externa perdida.",
        status: "AGENDADO",
        patientId: "pat-002",
        userId: "usr-social-004",
        createdAt: new Date("2026-07-17T15:05:00Z")
      }
    ],
    skipDuplicates: true,
  });
}