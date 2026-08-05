import { PrismaClient, DocumentType } from "@prisma/client";

export async function seedPatientDocuments(prisma: PrismaClient) {
  await prisma.patientDocument.createMany({
    data: [
      {
        id: "doc-001",
        nome: "Receita_Losartana_Antonio.pdf",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/receita_losartana.pdf",
        tipo: DocumentType.RECEITA,

        patientId: "pat-001",

        createdAt: new Date("2026-07-01T10:30:00Z"),
      },

      {
        id: "doc-002",
        nome: "Exame_Glicemia_Antonio.pdf",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/exame_glicemia.pdf",
        tipo: DocumentType.EXAME,

        patientId: "pat-001",

        createdAt: new Date("2026-07-01T15:10:00Z"),
      },

      {
        id: "doc-003",
        nome: "Laudo_Neurologico_Alzheimer_Maria.pdf",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/laudo_maria_alz.pdf",
        tipo: DocumentType.EXAME,

        patientId: "pat-002",

        createdAt: new Date("2026-07-02T14:30:00Z"),
      },

      {
        id: "doc-004",
        nome: "Contrato_Internacao_Maria.pdf",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/contrato_maria.pdf",
        tipo: DocumentType.CONTRATO,

        patientId: "pat-002",

        createdAt: new Date("2026-07-02T09:20:00Z"),
      },

      {
        id: "doc-005",
        nome: "RG_Geraldo.pdf",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/rg_geraldo.pdf",
        tipo: DocumentType.IDENTIDADE,

        patientId: "pat-003",

        createdAt: new Date("2026-07-03T08:00:00Z"),
      },

      {
        id: "doc-006",
        nome: "Foto_Paciente_Francisca.jpg",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/foto_francisca.jpg",
        tipo: DocumentType.FOTO,

        patientId: "pat-004",

        createdAt: new Date("2026-07-04T09:15:00Z"),
      },

      {
        id: "doc-007",
        nome: "Receita_Prolopa_Francisca.pdf",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/receita_prolopa.pdf",
        tipo: DocumentType.RECEITA,

        patientId: "pat-004",

        createdAt: new Date("2026-07-05T09:00:00Z"),
      },

      {
        id: "doc-008",
        nome: "Receita_Medica_Desatualizada_Furosemida.pdf",
        arquivo:
          "https://carehome-storage.s3.amazonaws.com/documents/receita_furo_old.pdf",
        tipo: DocumentType.RECEITA,

        patientId: "pat-004",

        createdAt: new Date("2026-07-05T09:00:00Z"),

        // Soft delete realizado pela médica
        deletedAt: new Date("2026-07-12T11:15:00Z"),
        deletedBy: "Dra. Helena Souza Ramos",
        deletedByUserId: "usr-doctor-003",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Documentos dos pacientes criados com sucesso.");
}