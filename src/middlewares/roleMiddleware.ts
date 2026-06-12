import { NextFunction, Request, Response } from "express";

export function roleMiddleware(...roles: string[]) {
  return (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user;

    if (!user) {
      return response.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    if (!roles.includes(user.cargo)) {
      return response.status(403).json({
        error: "Acesso negado",
      });
    }

    next();
  };
}