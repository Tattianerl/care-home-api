-- AlterTable
ALTER TABLE "NutritionalAssessment" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "NutritionalAssessment" ADD CONSTRAINT "NutritionalAssessment_deletedByUserId_fkey" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
