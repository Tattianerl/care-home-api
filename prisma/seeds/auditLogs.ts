import { PrismaClient } from "@prisma/client";

export async function seedAuditLogs(prisma: PrismaClient) {
  await prisma.auditLog.createMany({
    data: [
      {
        id: "log-001",
        acao: "CREATE",
        entidade: "User",
        entidadeId: "usr-doctor-001",
        descricao: "Cadastro do usuário Dra. Helena Souza Ramos (Médica) realizado pelo administrador.",
        userId: "usr-admin-007",
        createdAt: new Date("2026-07-01T08:30:00Z")
      },
      {
        id: "log-003",
        acao: "CREATE",
        entidade: "Patient",
        entidadeId: "pat-001",
        descricao: "Admissão e cadastro inicial do paciente Antônio Silva Medeiros no sistema.",
        userId: "usr-admin-007",
        createdAt: new Date("2026-07-01T09:15:00Z")
      },
      {
        id: "log-004",
        acao: "CREATE",
        entidade: "Medication",
        entidadeId: "med-001",
        descricao: "Prescrição inicial de Losartana Potássica adicionada ao prontuário.",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-01T10:00:00Z")
      },
      {
        id: "log-024",
        acao: "UPDATE",
        entidade: "Patient",
        entidadeId: "pat-004",
        descricao: "Alteração de dados médicos: Campo observações atualizado com Alerta de Restrição Hídrica.",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-12T10:50:00Z")
      },
      {
        id: "log-026",
        acao: "DELETE",
        entidade: "PatientDocument",
        entidadeId: "doc-008",
        descricao: "Exclusão lógica do documento Receita_Medica_Desatualizada_Furosemida.pdf para evitar erros da equipe.",
        userId: "usr-doctor-001",
        createdAt: new Date("2026-07-12T11:15:00Z")
      }
    ],
    skipDuplicates: true,
  });
}