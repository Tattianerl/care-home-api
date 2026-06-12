/*
  Warnings:

  - You are about to drop the column `horario` on the `Medication` table. All the data in the column will be lost.
  - Added the required column `frequencia` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viaAdministracao` to the `Medication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "horario",
ADD COLUMN     "frequencia" TEXT NOT NULL,
ADD COLUMN     "viaAdministracao" TEXT NOT NULL;
