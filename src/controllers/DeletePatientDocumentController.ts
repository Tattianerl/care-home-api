import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class DeletePatientDocumentController {
  async handle(request: Request, response: Response) {
    const documentId = request.params.id as string;

    const user = (request as any).user; 
    
    if (!user) {
      return response.status(401).json({
        error: "Usuário não autenticado.",
      });
    }

   // Buscar documento
    const document = await prisma.patientDocument.findUnique({
      where: { id: documentId },
    });
    
    if (!document) {
      return response.status(404).json({
        error: "Documento não encontrado.",
      });
    }
      if (document.deletedAt) {
    return response.status(409).json({
      error: "Este documento já foi excluído.",
    });
  }

    try {

      await prisma.patientDocument.update({
        where: {
          id: documentId,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: user.id,

          deletedByUserId: user.id,
        },
      });
            
      // Registra a exclusão no Log de Auditoria
      await prisma.auditLog.create({
        data: {
          acao: "EXCLUSAO",
          entidade: "PatientDocument",
          entidadeId: documentId,
          descricao: `Documento "${document.nome}" do paciente ${document.patientId} foi marcado como excluído por ${user.nome}.`,
          userId: user.id
        }
      });

      return response.status(204).send(); 

    } catch (error) {
      console.error("Erro no processo de exclusão:", error);
      return response.status(500).json({
        error: "Erro interno ao tentar deletar o documento.",
      });
    }
  }
}