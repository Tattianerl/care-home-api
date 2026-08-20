import { PrismaClient } from "@prisma/client";

const USER_IDS = {
  MEDICO: "11111111-1111-4111-8111-111111111003",
  ENFERMEIRO: "11111111-1111-4111-8111-111111111004",
  FISIOTERAPEUTA: "11111111-1111-4111-8111-111111111006",
  NUTRICIONISTA: "11111111-1111-4111-8111-111111111007",
  ASSISTENTE_SOCIAL: "11111111-1111-4111-8111-111111111008",
};

const PATIENT_IDS = {
  ANTONIO: "22222222-2222-4222-8222-222222222001",
  MARIA: "22222222-2222-4222-8222-222222222002",
  GERALDO: "22222222-2222-4222-8222-222222222003",
  FRANCISCA: "22222222-2222-4222-8222-222222222004",
};

export async function seedEvolutions(prisma: PrismaClient) {
  await prisma.evolution.createMany({
    data: [
      {
        id: "33333333-3333-4333-8333-333333333001",
        descricao:
          "Paciente acordou orientado, alimentou-se normalmente e apresentou boa aceitação da dieta.",
        assinatura: "Roberto A. Lima - COREN/RJ 123456",
        patientId: PATIENT_IDS.ANTONIO,
        userId: USER_IDS.ENFERMEIRO,
        createdAt: new Date("2026-07-01T08:20:00Z"),
      },
      {
        id: "33333333-3333-4333-8333-333333333002",
        descricao:
          "Mantém pressão arterial controlada. Sem intercorrências clínicas.",
        assinatura: "Helena S. Ramos - CRM/RJ 554321",
        patientId: PATIENT_IDS.ANTONIO,
        userId: USER_IDS.MEDICO,
        createdAt: new Date("2026-07-01T10:00:00Z"),
      },
      {
        id: "33333333-3333-4333-8333-333333333003",
        descricao:
          "Paciente apresentou episódio de confusão no período noturno, sendo reorientada pela equipe.",
        assinatura: "Roberto A. Lima - COREN/RJ 123456",
        patientId: PATIENT_IDS.MARIA,
        userId: USER_IDS.ENFERMEIRO,
        createdAt: new Date("2026-07-02T22:10:00Z"),
      },
      {
        id: "33333333-3333-4333-8333-333333333004",
        descricao:
          "Sessão de fisioterapia realizada com boa resposta motora.",
        assinatura: "Marcos V. Dias - CREFITO/RJ 9876-F",
        patientId: PATIENT_IDS.GERALDO,
        userId: USER_IDS.FISIOTERAPEUTA,
        createdAt: new Date("2026-07-03T14:30:00Z"),
      },
      {
        id: "33333333-3333-4333-8333-333333333005",
        descricao:
          "Paciente aceitou integralmente a dieta prescrita.",
        assinatura: "Patrícia Albuquerque - CRN/RJ 88776",
        patientId: PATIENT_IDS.FRANCISCA,
        userId: USER_IDS.NUTRICIONISTA,
        createdAt: new Date("2026-07-04T12:00:00Z"),
      },
      {
        id: "33333333-3333-4333-8333-333333333006",
        descricao:
          "Visita familiar realizada sem intercorrências.",
        assinatura: "Clarice L. Fontes - CRESS/RJ 4567",
        patientId: PATIENT_IDS.MARIA,
        userId: USER_IDS.ASSISTENTE_SOCIAL,
        createdAt: new Date("2026-07-05T16:20:00Z"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Evoluções criadas com sucesso.");
}