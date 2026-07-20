import { PrismaClient } from "@prisma/client";

export async function seedPatients(prisma: PrismaClient) {
  await prisma.patient.createMany({
    data: [
      {
        id: "pat-001",
        nome: "Antônio Silva Medeiros",
        dataNascimento: new Date("1945-03-15T00:00:00Z"),
        responsavel: "Carlos Medeiros (Filho)",
        telefone: "(21) 98888-7777",
        historicoMedico: "Hipertensão crônica, Diabetes Tipo 2.",
        medicamentos: "Losartana 50mg, Metformina 850mg.",
        alergias: "Penicilina",
        diagnosticos: "Hipertensão Arterial Sistêmica",
        observacoes: "Necessita de auxílio leve para deambular.",
        ativo: true,
        createdAt: new Date("2026-07-01T09:15:00Z")
      },
      {
        id: "pat-002",
        nome: "Maria das Dores Camargo",
        dataNascimento: new Date("1938-11-22T00:00:00Z"),
        responsavel: "Ana Camargo (Filha)",
        telefone: "(21) 97777-6666",
        historicoMedico: "Alzheimer em estágio moderado, osteoporose.",
        medicamentos: "Donepezila 10mg, Carbonato de Cálcio.",
        alergias: "Sem alergias conhecidas",
        diagnosticos: "Doença de Alzheimer",
        observacoes: "Episódios ocasionais de desorientação noturna.",
        ativo: true,
        createdAt: new Date("2026-07-02T10:00:00Z")
      },
      {
        id: "pat-003",
        nome: "Geraldo Alckmin Faria",
        dataNascimento: new Date("1950-05-30T00:00:00Z"),
        responsavel: "Mariana Faria (Esposa)",
        telefone: "(21) 96666-5555",
        historicoMedico: "Cardiopatia isquêmica, pós-infarto (2022).",
        medicamentos: "AAS 100mg, Selozok 50mg.",
        alergias: "Sulfa",
        diagnosticos: "Insuficiência Cardíaca Coronariana",
        observacoes: "Restrição de esforço físico intenso.",
        ativo: true,
        createdAt: new Date("2026-07-03T11:00:00Z")
      },
      {
        id: "pat-004",
        nome: "Francisca Nogueira Abreu",
        dataNascimento: new Date("1935-08-12T00:00:00Z"),
        responsavel: "Roberto Abreu (Neto)",
        telefone: "(21) 95555-4444",
        historicoMedico: "Doença de Parkinson, disfagia leve.",
        medicamentos: "Prolopa 200mg/50mg.",
        alergias: "Dipirona",
        diagnosticos: "Parkinson Avançado",
        observacoes: "Dieta pastosa. Alerta para restrição hídrica devido a edemas.",
        ativo: true,
        createdAt: new Date("2026-07-04T09:00:00Z")
      }
    ],
    skipDuplicates: true,
  });
}