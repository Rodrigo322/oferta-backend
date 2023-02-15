import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createNivelAcesso = async (req: Request, res: Response) => {
  const { nivelAcessoNome } = req.body;

  try {
    const novoNivelAcesso = await prisma.nivelAcesso.create({
      data: {
        nome: nivelAcessoNome,
      },
    });
    return res.json(novoNivelAcesso);
  } catch (error) {
    console.error(`Erro ao criar novo nível de acesso: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
};
