/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/users";
import { seedPatients } from "./seeds/patients";
import { seedVitalSigns } from "./seeds/vitalSigns";
import { seedEvolutions } from "./seeds/evolutions";
import { seedMedications } from "./seeds/medications";
import { seedAppointments } from "./seeds/appointments";
import { seedPatientDocuments } from "./seeds/documents";
import { seedNutritionalAssessments } from "./seeds/nutritionalAssessments";
import { seedAuditLogs } from "./seeds/auditLogs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Iniciando limpeza completa do banco de dados...");

  // Ordem reversa perfeita para não quebrar restrições de chaves estrangeiras (FK)
  await prisma.auditLog.deleteMany({});
  await prisma.nutritionalAssessment.deleteMany({});
  await prisma.patientDocument.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.medication.deleteMany({});
  await prisma.evolution.deleteMany({});
  await prisma.vitalSign.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Banco de dados limpo.");

  // Executa cada seed individual na ordem correta
  console.log("🌱 Executando seeds...");
  await seedUsers(prisma);
  await seedPatients(prisma);
  await seedVitalSigns(prisma);
  await seedEvolutions(prisma);
  await seedMedications(prisma);
  await seedAppointments(prisma);
  await seedPatientDocuments(prisma);
  await seedNutritionalAssessments(prisma);
  await seedAuditLogs(prisma);

  console.log("🚀 Todos os dados populados com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro ao rodar as sementes:", e);
    await prisma.$disconnect();
    process.exit(1);
  });