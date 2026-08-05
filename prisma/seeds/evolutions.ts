import { PrismaClient } from "@prisma/client";

export async function seedEvolutions(prisma: PrismaClient) {
  // Busca todos os usuários cadastrados
  const users = await prisma.user.findMany({
    take: 10,
  });

  if (users.length === 0) {
    console.warn(
      "⚠️ Nenhum usuário encontrado para vincular às evoluções. Seed ignorado."
    );
    return;
  }

  // Define fallbacks seguros usando os usuários reais cadastrados
  const getUser = (index: number) => users[index]?.id ?? users[0].id;

  // Tenta encontrar IDs específicos se existirem, senão distribui entre os usuários do banco
  const nurseId = (await prisma.user.findUnique({ where: { id: "usr-nurse-002" } }))?.id ?? getUser(0);
  const doctorId = (await prisma.user.findUnique({ where: { id: "usr-doctor-001" } }))?.id ?? getUser(1);
  const physioId = (await prisma.user.findUnique({ where: { id: "usr-physio-003" } }))?.id ?? getUser(2);
  const nutriId = (await prisma.user.findUnique({ where: { id: "usr-nutri-005" } }))?.id ?? getUser(3);
  const socialId = (await prisma.user.findUnique({ where: { id: "usr-social-004" } }))?.id ?? getUser(4);

  await prisma.evolution.createMany({
    data: [
      {
        id: "evo-001",
        descricao:
          "Paciente acordou orientado, alimentou-se normalmente e apresentou boa aceitação da dieta.",
        assinatura: "Roberto A. Lima - COREN/RJ 123456",
        patientId: "pat-001",
        userId: nurseId,
        createdAt: new Date("2026-07-01T08:20:00Z"),
      },
      {
        id: "evo-002",
        descricao:
          "Mantém pressão arterial controlada. Sem intercorrências clínicas.",
        assinatura: "Helena S. Ramos",
        patientId: "pat-001",
        userId: doctorId,
        createdAt: new Date("2026-07-01T10:00:00Z"),
      },
      {
        id: "evo-003",
        descricao:
          "Paciente apresentou episódio de confusão no período noturno, sendo reorientada pela equipe.",
        assinatura: "Roberto A. Lima",
        patientId: "pat-002",
        userId: nurseId,
        createdAt: new Date("2026-07-02T22:10:00Z"),
      },
      {
        id: "evo-004",
        descricao:
          "Sessão de fisioterapia realizada com boa resposta motora.",
        assinatura: "Marcos V. Dias",
        patientId: "pat-003",
        userId: physioId,
        createdAt: new Date("2026-07-03T14:30:00Z"),
      },
      {
        id: "evo-005",
        descricao:
          "Paciente aceitou integralmente a dieta prescrita.",
        assinatura: "Patrícia Albuquerque",
        patientId: "pat-004",
        userId: nutriId,
        createdAt: new Date("2026-07-04T12:00:00Z"),
      },
      {
        id: "evo-006",
        descricao:
          "Visita familiar realizada sem intercorrências.",
        assinatura: "Clarice L. Fontes",
        patientId: "pat-002",
        userId: socialId,
        createdAt: new Date("2026-07-05T16:20:00Z"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Evoluções criadas com sucesso.");
}