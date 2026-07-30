/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "cartaoSus" TEXT,
ADD COLUMN     "contatoEmergencia" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "fotoUrl" TEXT,
ADD COLUMN     "genero" TEXT,
ADD COLUMN     "grauDependencia" TEXT,
ADD COLUMN     "planoSaude" TEXT,
ADD COLUMN     "quartoLeito" TEXT,
ADD COLUMN     "responsavelCpf" TEXT,
ADD COLUMN     "responsavelEmail" TEXT,
ADD COLUMN     "responsavelEndereco" TEXT,
ADD COLUMN     "responsavelGrauParentesco" TEXT,
ADD COLUMN     "restricaoAlimentar" TEXT,
ADD COLUMN     "rg" TEXT,
ADD COLUMN     "tipoSanguineo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "Patient"("cpf");
