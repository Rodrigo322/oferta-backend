import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();

interface DecodedToken {
  userId: number;
}

export function authMiddleware(permissions?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido" });
    }
    const token = authHeader.substring(7);
    try {
      const decodedToken = verify(token, "secret") as DecodedToken;
      req.user = { id: decodedToken.userId };
      // Verifica as permissões do usuário
      if (permissions) {
        const user = await prisma.usuario.findUnique({
          where: {
            id: decodedToken.userId,
          },
          include: {
            NivelAcesso: true,
          },
        });
        const userPermissions = user?.NivelAcesso.map((na) => na.nome) ?? [];
        const hasPermission = permissions.some((p) =>
          userPermissions.includes(p)
        );
        if (!hasPermission) {
          return res.status(403).json({ message: "Permissão negada" });
        }
      }
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
}
