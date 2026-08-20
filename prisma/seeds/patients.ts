import {
  PrismaClient,
  BloodType,
  DependencyLevel,
  Gender,
  MaritalStatus,
} from "@prisma/client";

export async function seedPatients(prisma: PrismaClient) {
  await prisma.patient.createMany({
    data: [
      {
        id: "22222222-2222-4222-8222-222222222001",
        nome: "Antônio Silva Medeiros",
        dataNascimento: new Date("1945-03-15"),

        cpf: "123.456.789-01",
        rg: "12.345.678-9",
        naturalidade: "Rio de Janeiro - RJ",
        estadoCivil: MaritalStatus.CASADO,

        cartaoSus: "898001234567890",
        fotoUrl: null,

        quartoLeito: "101-A",
        genero: Gender.MASCULINO,

        responsavel: "Carlos Medeiros",
        telefone: "(21) 98888-7777",
        responsavelCpf: "111.111.111-11",
        responsavelGrauParentesco: "Filho",
        responsavelEmail: "carlos@email.com",
        responsavelEndereco: "Rua das Palmeiras, 120 - Rio de Janeiro",

        tipoSanguineo: BloodType.O_POSITIVO,
        planoSaude: "Unimed",
        contatoEmergencia: "(21) 99999-8888",

        grauDependencia: DependencyLevel.PARCIAL,

        historicoMedico:
          "Hipertensão arterial sistêmica e Diabetes Mellitus tipo 2.",

        alergias: "Penicilina",

        diagnosticos: "Hipertensão arterial sistêmica.",

        restricaoAlimentar: "Dieta hipossódica.",

        observacoes: "Necessita auxílio parcial para locomoção.",

        ativo: true,
        falecido: false,

        dataInternacao: new Date("2026-06-01"),
        createdAt: new Date("2026-07-01"),
      },

      {
        id: "22222222-2222-4222-8222-222222222002",
        nome: "Maria das Dores Camargo",
        dataNascimento: new Date("1938-11-22"),

        cpf: "234.567.890-12",
        rg: "23.456.789-1",
        naturalidade: "Niterói - RJ",
        estadoCivil: MaritalStatus.VIUVO,

        cartaoSus: "898001234567891",

        quartoLeito: "102-B",
        genero: Gender.FEMININO,

        responsavel: "Ana Camargo",
        telefone: "(21) 97777-6666",
        responsavelCpf: "222.222.222-22",
        responsavelGrauParentesco: "Filha",
        responsavelEmail: "ana@email.com",

        tipoSanguineo: BloodType.A_POSITIVO,
        planoSaude: "Bradesco Saúde",
        contatoEmergencia: "(21) 99999-1111",

        grauDependencia: DependencyLevel.TOTAL,

        historicoMedico:
          "Alzheimer em estágio moderado e osteoporose.",

        alergias: "Nenhuma.",

        diagnosticos: "Doença de Alzheimer.",

        restricaoAlimentar: "Alimentos pastosos.",

        observacoes:
          "Apresenta episódios de desorientação no período noturno.",

        ativo: true,
        falecido: false,

        dataInternacao: new Date("2026-06-12"),
        createdAt: new Date("2026-07-02"),
      },

      {
        id: "22222222-2222-4222-8222-222222222003",
        nome: "Geraldo Alckmin Faria",
        dataNascimento: new Date("1950-05-30"),

        cpf: "345.678.901-23",
        rg: "34.567.890-2",
        naturalidade: "Campos dos Goytacazes - RJ",
        estadoCivil: MaritalStatus.CASADO,

        cartaoSus: "898001234567892",

        quartoLeito: "103-A",
        genero: Gender.MASCULINO,

        responsavel: "Mariana Faria",
        telefone: "(21) 96666-5555",
        responsavelCpf: "333.333.333-33",
        responsavelGrauParentesco: "Esposa",
        responsavelEmail: "mariana@email.com",

        tipoSanguineo: BloodType.B_POSITIVO,
        planoSaude: "Amil",
        contatoEmergencia: "(21) 98888-4444",

        grauDependencia: DependencyLevel.INDEPENDENTE,

        historicoMedico:
          "Cardiopatia isquêmica pós-infarto.",

        alergias: "Sulfa.",

        diagnosticos: "Insuficiência cardíaca.",

        restricaoAlimentar: "Baixo teor de gordura.",

        observacoes: "Paciente orientado e independente.",

        ativo: true,
        falecido: false,

        dataInternacao: new Date("2026-06-20"),
        createdAt: new Date("2026-07-03"),
      },

      {
        id: "22222222-2222-4222-8222-222222222004",
        nome: "Francisca Nogueira Abreu",
        dataNascimento: new Date("1935-08-12"),

        cpf: "456.789.012-34",
        rg: "45.678.901-3",
        naturalidade: "Petrópolis - RJ",
        estadoCivil: MaritalStatus.CASADO,

        cartaoSus: "898001234567893",

        quartoLeito: "104-C",
        genero: Gender.FEMININO,

        responsavel: "Roberto Abreu",
        telefone: "(21) 95555-4444",
        responsavelCpf: "444.444.444-44",
        responsavelGrauParentesco: "Neto",
        responsavelEmail: "roberto@email.com",

        tipoSanguineo: BloodType.AB_POSITIVO,
        planoSaude: "SulAmérica",
        contatoEmergencia: "(21) 97777-3333",

        grauDependencia: DependencyLevel.TOTAL,

        historicoMedico: "Doença de Parkinson avançada.",

        alergias: "Dipirona.",

        diagnosticos: "Parkinson.",

        restricaoAlimentar: "Dieta pastosa.",

        observacoes:
          "Necessita auxílio integral para alimentação e higiene.",

        ativo: true,
        falecido: false,

        dataInternacao: new Date("2026-05-15"),
        createdAt: new Date("2026-07-04"),
      },
    ],

    skipDuplicates: true,
  });

  console.log("✅ Pacientes criados com sucesso.");
}