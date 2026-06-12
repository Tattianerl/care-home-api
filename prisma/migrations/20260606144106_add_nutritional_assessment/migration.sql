-- CreateTable
CREATE TABLE "NutritionalAssessment" (
    "id" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "imc" DOUBLE PRECISION,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NutritionalAssessment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NutritionalAssessment" ADD CONSTRAINT "NutritionalAssessment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionalAssessment" ADD CONSTRAINT "NutritionalAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
