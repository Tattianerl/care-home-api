import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
  // Criptografa a senha uma única vez para otimizar a execução do seed
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        id: "usr-doctor-001",
        nome: "Dra. Helena Souza Ramos",
        cpf: "111.222.333-44",
        email: "helena.ramos@carehome.com",
        senha: password,
        cargo: "medico",
        assinatura: "Helena S. Ramos - CRM/RJ 554321",
        ativo: true,
        createdAt: new Date("2026-07-01T08:30:00Z")
      },
      {
        id: "usr-nurse-002",
        nome: "Enf. Roberto Alves Lima",
        cpf: "222.333.444-55",
        email: "roberto.lima@carehome.com",
        senha: password,
        cargo: "enfermeiro",
        assinatura: "Roberto A. Lima - COREN/RJ 123.456",
        ativo: true,
        createdAt: new Date("2026-07-01T08:45:00Z")
      },
      {
        id: "usr-physio-003",
        nome: "Dr. Marcos Vinícius Dias",
        cpf: "333.444.555-66",
        email: "marcos.dias@carehome.com",
        senha: password,
        cargo: "fisioterapeuta",
        assinatura: "Marcos V. Dias - CREFITO/RJ 9876-F",
        ativo: true,
        createdAt: new Date("2026-07-01T09:00:00Z")
      },
      {
        id: "usr-social-004",
        nome: "Clarice Lispector Fontes",
        cpf: "444.555.667-77",
        email: "clarice.fontes@carehome.com",
        senha: password,
        cargo: "assistente_social",
        assinatura: "Clarice L. Fontes - CRESS/RJ 4567",
        ativo: true,
        createdAt: new Date("2026-07-01T09:15:00Z")
      },
      {
        id: "usr-nutri-005",
        nome: "Dra. Patrícia Albuquerque",
        cpf: "555.666.777-88",
        email: "patricia.albuquerque@carehome.com",
        senha: password,
        cargo: "nutricionista",
        assinatura: "Patrícia Albuquerque - CRN/RJ 88776",
        ativo: true,
        createdAt: new Date("2026-07-01T09:30:00Z")
      },
      {
        id: "usr-care-006",
        nome: "Carlos Eduardo Santos",
        cpf: "666.777.888-99",
        email: "carlos.santos@carehome.com",
        senha: password,
        cargo: "tecnico_enfermagem",
        assinatura: "Carlos E. Santos - COREN/RJ 998.887-TE",
        ativo: true,
        createdAt: new Date("2026-07-01T09:45:00Z")
      },
      {
        id: "usr-admin-007",
        nome: "Clara Antunes Vieira",
        cpf: "777.888.999-00",
        email: "clara.vieira@carehome.com",
        senha: password,
        cargo: "admin",
        assinatura: "Administração Central CareHome",
        ativo: true,
        createdAt: new Date("2026-07-01T08:00:00Z")
      },
      {
        id: "usr-recep-008",
        nome: "Mariana Costa Silva",
        cpf: "888.999.000-11",
        email: "mariana.silva@carehome.com",
        senha: password,
        cargo: "recepcao",
        assinatura: null,
        ativo: true,
        createdAt: new Date("2026-07-01T08:15:00Z")
      }
    ],
    skipDuplicates: true,
  });
}