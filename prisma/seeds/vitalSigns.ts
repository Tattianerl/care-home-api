import { PrismaClient } from "@prisma/client";

export async function seedVitalSigns(prisma: PrismaClient) {
  await prisma.vitalSign.createMany({
    data: [
      {
        id: "vit-001",
        pressao: "120/80",
        temperatura: 36.5,
        glicemia: 110.0,
        frequenciaCardiaca: 72,
        saturacao: 98,
        observacoes: "Sinais estáveis após café da manhã.",
        patientId: "pat-001",
        userId: "usr-nurse-002",
        createdAt: new Date("2026-07-10T08:05:00Z")
      },
      {
        id: "vit-010",
        pressao: "100/60",
        temperatura: 36.2,
        glicemia: 95.0,
        frequenciaCardiaca: 60,
        saturacao: 95,
        observacoes: "Aferição realizada por queixa de fraqueza e fadiga.",
        patientId: "pat-004",
        userId: "usr-nurse-002",
        createdAt: new Date("2026-07-11T10:05:00Z")
      },
      {
        id: "vit-013",
        pressao: "130/85",
        temperatura: 36.8,
        glicemia: null,
        frequenciaCardiaca: 78,
        saturacao: 96,
        observacoes: "Aferição de rotina no leito.",
        patientId: "pat-002",
        userId: "usr-care-006",
        createdAt: new Date("2026-07-08T10:05:00Z")
      },
      {
        id: "vit-019",
        pressao: "140/90",
        temperatura: 37.1,
        glicemia: null,
        frequenciaCardiaca: 95,
        saturacao: 86,
        observacoes: "Alerta de saturação crítica. Paciente em ar ambiente.",
        patientId: "pat-003",
        userId: "usr-nurse-002",
        createdAt: new Date("2026-07-12T14:35:00Z")
      }
    ],
    skipDuplicates: true,
  });
}