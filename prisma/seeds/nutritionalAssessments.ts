import { PrismaClient } from "@prisma/client";

export async function seedNutritionalAssessments(
  prisma: PrismaClient,
) {
  await prisma.nutritionalAssessment.createMany({
    data: [
      {
        id: "nut-001",
        peso: 70.5,
        altura: 1.68,
        imc: 24.98,
        classificacaoImc: "Peso adequado",
        observacoes:
          "Peso estável em relação ao mês anterior. Manter dieta atual.",
        patientId: "22222222-2222-4222-8222-222222222001",
        userId: "11111111-1111-4111-8111-111111111007",
        createdAt: new Date("2026-07-18T11:05:00Z"),
      },

      {
        id: "nut-005",
        peso: 55.2,
        altura: 1.60,
        imc: 21.56,
        classificacaoImc: "Peso adequado",
        observacoes:
          "Triagem aponta risco leve de perda ponderal. Iniciar suplemento proteico no lanche.",
        patientId: "22222222-2222-4222-8222-222222222002",
        userId: "11111111-1111-4111-8111-111111111007",
        createdAt: new Date("2026-07-10T09:30:00Z"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Avaliações nutricionais criadas com sucesso.");
}