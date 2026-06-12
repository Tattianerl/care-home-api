import { prisma } from "../lib/prisma";


interface AuditLogData {
  userId: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  descricao?: string;
}

export async function createAuditLog({
  userId,
  acao,
  entidade,
  entidadeId,
  descricao,
}: AuditLogData) {

  await prisma.auditLog.create({
    data: {
      userId,
      acao,
      entidade,
      entidadeId,
      descricao,
    },
  });

}