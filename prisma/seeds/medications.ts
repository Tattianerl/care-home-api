import { PrismaClient } from "@prisma/client";

export async function seedMedications(prisma: PrismaClient) {
  await prisma.medication.createMany({
    data: [
      {
        id: "med-001",
        nome: "Losartana Potássica",
        dosagem: "50mg",
        frequencia: "A cada 12 horas",
        viaAdministracao: "Oral",
        observacoes: "Administrar preferencialmente às 08h e às 20h.",
        patientId: "pat-001",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-01T10:00:00Z")
      },
      {
        id: "med-005",
        nome: "AAS (Ácido Acetilsalicílico)",
        dosagem: "100mg",
        frequencia: "Uma vez ao dia",
        viaAdministracao: "Oral",
        observacoes: "Administrar logo após o almoço.",
        patientId: "pat-003",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-03T12:05:00Z")
      },
      {
        id: "med-007",
        nome: "Furosemida",
        dosagem: "40mg",
        frequencia: "Uso emergencial / SOS",
        viaAdministracao: "Oral",
        observacoes: "Aplicar dose extra se houver relato severo de edema.",
        patientId: "pat-004",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-12T11:05:00Z")
      }
    ],
    skipDuplicates: true,
  });
}