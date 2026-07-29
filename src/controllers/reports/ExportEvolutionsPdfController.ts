import { Request, Response } from "express";
import { prisma } from "../../lib/prisma"; // ajuste o caminho conforme sua estrutura
import { generateEvolutionsPdf } from "../../utils/exportPdf";

export class ExportEvolutionsPdfController {
  async handle(request: Request, response: Response) {
    try {
      const { patientId } = request.query;

      // Filtro opcional por paciente
      const whereCondition = patientId ? { patientId: String(patientId) } : {};

      const evolutions = await prisma.evolution.findMany({
        where: whereCondition,
        include: {
          patient: { select: { nome: true } },
          user: { select: { nome: true, cargo: true, assinatura: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const items = evolutions.map((e) => ({
        data: new Date(e.createdAt).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        paciente: e.patient.nome,
        profissional: e.user.nome,
        cargo: e.user.cargo ?? "Profissional de Saúde",
        descricao: e.descricao,
        // Pega a assinatura salva na evolução (snapshot) ou a do perfil do usuário no Supabase
        assinaturaUrl: e.assinatura || e.user.assinatura,
      }));

      const isSinglePatient = patientId && evolutions.length > 0;
      const title = isSinglePatient
        ? `Prontuário de Evoluções — ${evolutions[0].patient.nome}`
        : "Relatório Geral de Evoluções Clínicas";

      return await generateEvolutionsPdf(response, {
        title,
        subtitle: `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`,
        filename: isSinglePatient ? `evolucoes_${patientId}.pdf` : "relatorio_evolucoes.pdf",
        items,
      });
    } catch (error) {
      console.error("[ExportEvolutionsPdfController] Erro ao gerar PDF:", error);
      return response.status(500).json({ error: "Falha ao gerar relatório em PDF" });
    }
  }
}