-- CreateTable
CREATE TABLE "Evolution" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "assinatura" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Evolution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
