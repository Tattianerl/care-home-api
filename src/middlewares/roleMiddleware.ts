import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";

export function roleMiddleware(...roles: (UserRole | string)[]) {
  return (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user;

    if (!user || !user.cargo) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const normalizedRoles = roles.map((role) => String(role).toUpperCase());
    const userRole = String(user.cargo).toUpperCase();

    if (!normalizedRoles.includes(userRole)) {
      return response.status(403).json({
        error: "Acesso negado",
      });
    }

    next();
  };
}