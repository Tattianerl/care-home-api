import { PrismaClient } from "@prisma/client";

export async function seedPatientDocuments(prisma: PrismaClient) {
  await prisma.patientDocument.createMany({
    data: [
      {
        id: "doc-003",
        nome: "Laudo_Neurologico_Alzheimer_Maria.pdf",
        arquivo: "https://carehome-storage.s3.amazonaws.com/documents/laudo_maria_alz.pdf",
        patientId: "pat-002",
        deletedAt: null,
        deletedBy: null,
        deletedByUserId: null,
        createdAt: new Date("2026-07-02T14:30:00Z")
      },
      {
        id: "doc-008",
        nome: "Receita_Medica_Desatualizada_Furosemida.pdf",
        arquivo: "https://carehome-storage.s3.amazonaws.com/documents/receita_furo_old.pdf",
        patientId: "pat-004",
        deletedAt: new Date("2026-07-12T11:15:00Z"),
        deletedBy: "Dra. Helena Souza Ramos",
        deletedByUserId: "usr-doctor-001", 
        createdAt: new Date("2026-07-05T09:00:00Z")
      }
    ],
    skipDuplicates: true,
  });
}