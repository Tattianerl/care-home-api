/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import { usersSeed } from "./seeds/users"; 
import { patientsSeed } from "./seeds/patients";
import { vitalSignsSeed } from "./seeds/vitalSigns";
import { evolutionsSeed } from "./seeds/evolutions";
import { medicationsSeed } from "./seeds/medications";
import { appointmentsSeed } from "./seeds/appointments";
import { patientDocumentsSeed } from "./seeds/documents";
import { nutritionalAssessmentsSeed } from "./seeds/nutritionalAssessments";
import { auditLogsSeed } from "./seeds/auditLogs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Iniciando limpeza do banco de dados...");

  // Ordem reversa para evitar quebras de restrição de integridade
  await prisma.auditLog.deleteMany({});
  await prisma.nutritionalAssessment.deleteMany({});
  await prisma.patientDocument.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.medication.deleteMany({});
  await prisma.evolution.deleteMany({});
  await prisma.vitalSign.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Banco de dados limpo com sucesso.");

  console.log("🌱 Inserindo usuários...");
  for (const user of usersSeed) {
    await prisma.user.create({ data: user });
  }

  console.log("🌱 Inserindo pacientes...");
  for (const patient of patientsSeed) {
    await prisma.patient.create({ data: patient });
  }

  console.log("🌱 Inserindo sinais vitais...");
  for (const sign of vitalSignsSeed) {
    await prisma.vitalSign.create({ data: sign });
  }

  console.log("🌱 Inserindo evoluções...");
  for (const evo of evolutionsSeed) {
    await prisma.evolution.create({ data: evo });
  }

  console.log("🌱 Inserindo medicamentos...");
  for (const medication of medicationsSeed) {
    await prisma.medication.create({ data: medication });
  }

  console.log("🌱 Inserindo agendamentos...");
  for (const appointment of appointmentsSeed) {
    await prisma.appointment.create({ data: appointment });
  }

  console.log("🌱 Inserindo documentos de pacientes...");
  for (const doc of patientDocumentsSeed) {
    await prisma.patientDocument.create({ data: doc });
  }

  console.log("🌱 Inserindo avaliações nutricionais...");
  for (const assessment of nutritionalAssessmentsSeed) {
    await prisma.nutritionalAssessment.create({ data: assessment });
  }

  console.log("🌱 Inserindo logs de auditoria...");
  for (const log of auditLogsSeed) {
    await prisma.auditLog.create({ data: log });
  }

  console.log("🚀 Seed executado com sucesso! Todos os dados populados.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro ao rodar o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });