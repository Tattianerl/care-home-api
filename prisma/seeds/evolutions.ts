import { PrismaClient } from "@prisma/client";

export async function seedEvolutions(prisma: PrismaClient) {
  await prisma.evolution.createMany({
    data: [
      {
        id: "evo-001",
        descricao: "Paciente mantém quadro clínico estável. Diante dos parâmetros glicêmicos controlados, mantém-se a conduta medicamentosa atual.",
        assinatura: "Helena S. Ramos - CRM/RJ 554321",
        patientId: "pat-001",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-10T10:05:00Z")
      },
      {
        id: "evo-007",
        descricao: "Realizada conduta de cinesioterapia motora global. Paciente apresentou boa tolerância aos exercícios, sem sinais de fadiga limitante.",
        assinatura: "Marcos V. Dias - CREFITO/RJ 9876-F",
        patientId: "pat-002",
        userId: "usr-physio-003",
        createdAt: new Date("2026-07-09T14:35:00Z")
      },
      {
        id: "evo-010",
        descricao: "Identificado edema compressível (++) em membros inferiores. Comunicado ao corpo médico para avaliação de diuréticos.",
        assinatura: "Roberto A. Lima - COREN/RJ 123.456",
        patientId: "pat-004",
        userId: "usr-nurse-002",
        createdAt: new Date("2026-07-11T10:25:00Z")
      },
      {
        id: "evo-019",
        descricao: "Diante da queda abrupta de saturação (86%), instalado imediatamente cateter de oxigênio a 2L/min. Quadro estabilizado com saturação retornando para 94%.",
        assinatura: "Roberto A. Lima - COREN/RJ 123.456",
        patientId: "pat-003",
        userId: "usr-nurse-002",
        createdAt: new Date("2026-07-12T14:50:00Z")
      }
    ],
    skipDuplicates: true,
  });
}