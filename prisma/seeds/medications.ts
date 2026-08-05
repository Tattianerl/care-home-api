import {
  PrismaClient,
  MedicationStatus,
} from "@prisma/client";

export async function seedMedications(prisma: PrismaClient) {
  await prisma.medication.createMany({
    data: [
      {
        id: "med-001",

        nome: "Losartana Potássica",
        dosagem: "50 mg",
        frequencia: "12/12 horas",
        viaAdministracao: "Oral",

        horarios: ["08:00", "20:00"],

        inicioTratamento: new Date("2026-06-01"),

        status: MedicationStatus.ATIVO,

        controlado: false,
        usoContinuo: true,

        observacoes:
          "Administrar após café da manhã e jantar.",

        patientId: "pat-001",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-07-01T10:00:00Z"),
      },

      {
        id: "med-002",

        nome: "Metformina",
        dosagem: "850 mg",
        frequencia: "12/12 horas",
        viaAdministracao: "Oral",

        horarios: ["08:00", "20:00"],

        inicioTratamento: new Date("2026-05-15"),

        status: MedicationStatus.ATIVO,

        controlado: false,
        usoContinuo: true,

        observacoes:
          "Administrar junto às refeições.",

        patientId: "pat-001",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-07-01T10:05:00Z"),
      },

      {
        id: "med-003",

        nome: "Donepezila",
        dosagem: "10 mg",
        frequencia: "1x ao dia",
        viaAdministracao: "Oral",

        horarios: ["21:00"],

        inicioTratamento: new Date("2026-03-20"),

        status: MedicationStatus.ATIVO,

        controlado: false,
        usoContinuo: true,

        observacoes:
          "Administrar à noite.",

        patientId: "pat-002",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-07-02T09:00:00Z"),
      },

      {
        id: "med-004",

        nome: "Clonazepam",
        dosagem: "2 mg",
        frequencia: "Ao deitar",
        viaAdministracao: "Oral",

        horarios: ["22:00"],

        inicioTratamento: new Date("2026-06-10"),

        status: MedicationStatus.ATIVO,

        controlado: true,
        usoContinuo: true,

        observacoes:
          "Medicamento controlado. Administração exclusiva da enfermagem.",

        patientId: "pat-002",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-07-02T09:05:00Z"),
      },

      {
        id: "med-005",

        nome: "AAS",
        dosagem: "100 mg",
        frequencia: "1x ao dia",
        viaAdministracao: "Oral",

        horarios: ["12:00"],

        inicioTratamento: new Date("2026-05-20"),

        status: MedicationStatus.ATIVO,

        controlado: false,
        usoContinuo: true,

        observacoes:
          "Administrar após almoço.",

        patientId: "pat-003",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-07-03T12:00:00Z"),
      },

      {
        id: "med-006",

        nome: "Furosemida",
        dosagem: "40 mg",
        frequencia: "SOS",
        viaAdministracao: "Oral",

        horarios: [],

        inicioTratamento: new Date("2026-07-12"),

        status: MedicationStatus.ATIVO,

        controlado: false,
        usoContinuo: false,

        observacoes:
          "Administrar apenas quando houver edema importante.",

        patientId: "pat-004",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-07-12T11:05:00Z"),
      },

      {
        id: "med-007",

        nome: "Amoxicilina",
        dosagem: "500 mg",
        frequencia: "8/8 horas",
        viaAdministracao: "Oral",

        horarios: ["08:00", "16:00", "00:00"],

        inicioTratamento: new Date("2026-06-01"),
        fimTratamento: new Date("2026-06-08"),

        status: MedicationStatus.FINALIZADO,

        controlado: false,
        usoContinuo: false,

        observacoes:
          "Tratamento concluído.",

        patientId: "pat-001",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-06-01T08:00:00Z"),
      },

      {
        id: "med-008",

        nome: "Levodopa + Benserazida",
        dosagem: "200/50 mg",
        frequencia: "8/8 horas",
        viaAdministracao: "Oral",

        horarios: ["07:00", "15:00", "23:00"],

        inicioTratamento: new Date("2026-04-01"),

        status: MedicationStatus.ATIVO,

        controlado: false,
        usoContinuo: true,

        observacoes:
          "Paciente com Parkinson.",

        patientId: "pat-004",
        userId: "usr-doctor-003",
        prescritoPorId: "usr-doctor-003",

        createdAt: new Date("2026-07-04T10:00:00Z"),
      },
    ],

    skipDuplicates: true,
  });

  console.log("✅ Medicamentos criados com sucesso.");
}