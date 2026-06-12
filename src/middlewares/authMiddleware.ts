import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  cargo: string;
}

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      error: "Token não informado",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const { sub, cargo } = decoded as TokenPayload;

    request.user = {
      id: sub,
      cargo,
    };

    return next();
  } catch {
    return response.status(401).json({
      error: "Token inválido",
    });
  }
}