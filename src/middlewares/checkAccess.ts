import { NextFunction, Request, Response } from "express";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const checkAccess = (role: string) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const usuario = await prisma.usuario.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          NivelAcesso: true,
        },
      });

      if (!usuario) {
        return res.status(401).json({ mensagem: "Usuário não autenticado" });
      }

      const temPermissao = usuario.NivelAcesso.some(
        (nivelAcesso: any) => nivelAcesso.nome === role
      );

      if (!temPermissao) {
        return res.status(403).json({ mensagem: "Acesso negado" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  };
};
