-- AlterTable
ALTER TABLE "PatientDocument" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;
