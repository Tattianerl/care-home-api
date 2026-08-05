/*
  Warnings:

  - You are about to drop the column `medicamentos` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `PatientDocument` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cargo` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('ATIVO', 'SUSPENSO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COORDENADOR', 'ENFERMEIRO', 'TECNICO_ENFERMAGEM', 'MEDICO', 'FISIOTERAPEUTA', 'NUTRICIONISTA', 'PSICOLOGO', 'ASSISTENTE_SOCIAL', 'TERAPEUTA_OCUPACIONAL', 'FONOAUDIOLOGO', 'RECEPCAO');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RECEITA', 'EXAME', 'CONTRATO', 'IDENTIDADE', 'FOTO', 'EVOLUCAO', 'OUTRO');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "local" TEXT;

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "ip" TEXT;

-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "controlado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fimTratamento" TIMESTAMP(3),
ADD COLUMN     "horarios" JSONB,
ADD COLUMN     "inicioTratamento" TIMESTAMP(3),
ADD COLUMN     "prescritoPorId" TEXT,
ADD COLUMN     "status" "MedicationStatus" NOT NULL DEFAULT 'ATIVO',
ADD COLUMN     "usoContinuo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NutritionalAssessment" ADD COLUMN     "classificacaoImc" TEXT;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "medicamentos",
ADD COLUMN     "dataAlta" TIMESTAMP(3),
ADD COLUMN     "dataInternacao" TIMESTAMP(3),
ADD COLUMN     "falecido" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PatientDocument" ADD COLUMN     "tipo" "DocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dataAdmissao" TIMESTAMP(3),
ADD COLUMN     "fotoUrl" TEXT,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "registroProfissional" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "ultimoLogin" TIMESTAMP(3),
DROP COLUMN "cargo",
ADD COLUMN     "cargo" "UserRole" NOT NULL;

-- AlterTable
ALTER TABLE "VitalSign" ADD COLUMN     "peso" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_prescritoPorId_fkey" FOREIGN KEY ("prescritoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
