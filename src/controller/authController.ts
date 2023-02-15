import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const secret = "mysecretkey";

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  // Verifica as credenciais do usuário
  const user = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });
  if (!user || user.senha !== senha) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
  // Gera o token de autenticação
  const token = jwt.sign({ userId: user.id }, "secret");
  return res.json({ token });
};
