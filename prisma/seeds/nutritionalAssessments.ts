import { PrismaClient } from "@prisma/client";

export async function seedNutritionalAssessments(prisma: PrismaClient) {
  await prisma.nutritionalAssessment.createMany({
    data: [
      {
        id: "nut-001",
        peso: 70.5,
        altura: 1.68,
        imc: 24.98,
        observacoes: "Peso estável em relação ao mês anterior. Manter dieta atual.",
        patientId: "pat-001",
        userId: "usr-nutri-005",
        createdAt: new Date("2026-07-18T11:05:00Z")
      },
      {
        id: "nut-005",
        peso: 55.2,
        altura: 1.60,
        imc: 21.56,
        observacoes: "Triagem aponta risco leve de perda ponderal. Iniciar suplemento proteico no lanche.",
        patientId: "pat-002",
        userId: "usr-nutri-005",
        createdAt: new Date("2026-07-10T09:30:00Z")
      }
    ],
    skipDuplicates: true,
  });
}