import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createLoja = async (req: Request, res: Response) => {
  const { nome, descricao } = req.body;
  const { id } = req.user;

  try {
    const loja = await prisma.loja.create({
      data: {
        nome,
        descricao,
        usuario: {
          connect: { id: Number(id) },
        },
      },
    });

    return res.status(201).json({
      message: "Loja criada com sucesso!",
      loja,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar loja" });
  }
};

export const getAllLoja = async (req: Request, res: Response) => {
  const loja = await prisma.loja.findMany();

  return res.json(loja);
};
