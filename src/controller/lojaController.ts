import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createProduto = async (req: Request, res: Response) => {
  const { nome, descricao, preco } = req.body;
  const { lojaId } = req.params;

  if (!nome || !descricao || !preco || !lojaId) {
    return res
      .status(400)
      .json({ error: "Algum campo obrigatório não foi fornecido" });
  }

  const createdProduto = await prisma.produto.create({
    data: {
      nome,
      descricao,
      preco,
      Loja: {
        connect: {
          id: Number(lojaId),
        },
      },
    },
  });

  return res.json(createdProduto);
};

export const createLoja = async (req: Request, res: Response) => {
  const { nome, descricao } = req.body;
  const { id } = req.params;

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
