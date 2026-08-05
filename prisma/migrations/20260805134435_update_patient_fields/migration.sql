/*
  Warnings:

  - The `genero` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `grauDependencia` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipoSanguineo` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `pressao` on the `VitalSign` table. All the data in the column will be lost.
  - Added the required column `pressaoDiastolica` to the `VitalSign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pressaoSistolica` to the `VitalSign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DependencyLevel" AS ENUM ('INDEPENDENTE', 'PARCIAL', 'TOTAL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVO', 'A_NEGATIVO', 'B_POSITIVO', 'B_NEGATIVO', 'AB_POSITIVO', 'AB_NEGATIVO', 'O_POSITIVO', 'O_NEGATIVO');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "estadoCivil" "MaritalStatus",
ADD COLUMN     "naturalidade" TEXT,
DROP COLUMN "genero",
ADD COLUMN     "genero" "Gender" NOT NULL DEFAULT 'MASCULINO',
DROP COLUMN "grauDependencia",
ADD COLUMN     "grauDependencia" "DependencyLevel",
DROP COLUMN "tipoSanguineo",
ADD COLUMN     "tipoSanguineo" "BloodType";

-- AlterTable
ALTER TABLE "VitalSign" DROP COLUMN "pressao",
ADD COLUMN     "altura" DOUBLE PRECISION,
ADD COLUMN     "dor" INTEGER,
ADD COLUMN     "frequenciaRespiratoria" INTEGER,
ADD COLUMN     "pressaoDiastolica" INTEGER NOT NULL,
ADD COLUMN     "pressaoSistolica" INTEGER NOT NULL;
