import { AuditAction } from "../../constants/auditActions";
import { prisma } from "../../lib/prisma";

interface AuditLogData {
  userId: string;
  acao: AuditAction;
  entidade: string;
  entidadeId: string;
  descricao?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data,
    });
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error);
  }
}