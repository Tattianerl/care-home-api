import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ListPatientsController {
  async handle(request: Request, response: Response) {
    try {
      const pageParam = request.query.page;
      const limitParam = request.query.limit;
      const searchParam = request.query.search;
      const ativoParam = request.query.ativo;

      const page = pageParam !== undefined ? Number(pageParam) : 1;
      const limit = limitParam !== undefined ? Number(limitParam) : 10;

      if (!Number.isInteger(page) || page < 1) {
        return response.status(400).json({
          error: "Página inválida.",
        });
      }

      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return response.status(400).json({
          error: "Limite inválido. Informe um valor entre 1 e 100.",
        });
      }

      const search =
        searchParam !== undefined
          ? String(searchParam).trim()
          : "";

      let ativo: boolean | undefined;

      if (ativoParam !== undefined) {
        const ativoValue = String(ativoParam).toLowerCase();

        if (ativoValue !== "true" && ativoValue !== "false") {
          return response.status(400).json({
            error: "O parâmetro 'ativo' deve ser true ou false.",
          });
        }

        ativo = ativoValue === "true";
      }

      const where = {
        ...(ativo !== undefined && { ativo }),
        nome: {
          contains: search,
          mode: "insensitive" as const,
        },
      };

      const skip = (page - 1) * limit;

      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.patient.count({
          where,
        }),
      ]);

      return response.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: patients,
      });
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);

      return response.status(500).json({
        error: "Erro ao listar pacientes.",
      });
    }
  }
}