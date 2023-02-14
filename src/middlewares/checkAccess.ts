import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export const checkAccess = (role: string) => (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId; // Supondo que o ID do usuário esteja no corpo da requisição
  prisma.usuario.findUnique({
    where: {
      id: userId,
    },
  }).then((usuario) => {
    if (usuario?.nivelAcessoId?.some((nivel) => nivel.nome === role)) {
      next();
    } else {
      res.status(403).send("Acesso negado");
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send("Erro ao verificar permissão de acesso");
  });
};