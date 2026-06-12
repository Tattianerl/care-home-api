/*
  Warnings:

  - Added the required column `userId` to the `Medication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
