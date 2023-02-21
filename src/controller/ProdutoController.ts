import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createProduto = async (req: Request, res: Response) => {
  const { nome, descricao, preco, quantidade } = req.body;
  const { lojaId } = req.params;
  const { id } = req.user;

  const requestImage = req.file as Express.Multer.File;

  if (!nome || !descricao || !preco || !lojaId) {
    return res
      .status(400)
      .json({ error: "Algum campo obrigatório não foi fornecido" });
  }

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!usuario) {
    return res.status(400).json({ message: "usuario não encontado" });
  }

  const loja = await prisma.loja.findUnique({
    where: {
      id: Number(lojaId),
    },
  });

  if (!loja) {
    return res.status(400).json({ message: "loja não encontrada" });
  }

  if (usuario.id !== loja?.usuarioId) {
    return res.status(400).json({ message: "usuario não é dono desta loja" });
  }

  const createdProduto = await prisma.produto.create({
    data: {
      nome,
      descricao,
      preco: Number(preco),
      quantidade: Number(quantidade),
      img: `http://10.0.1.18:3333/image/${requestImage.filename}`,
      Loja: {
        connect: {
          id: Number(lojaId),
        },
      },
    },
  });

  return res.json(createdProduto);
};

export const getAllProdutos = async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        Loja: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (produtos.length < 0) {
      return res.status(204).json({ message: "Nenhum produto foi encontrado" });
    }

    return res.json(produtos);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro interno no servidor" });
  }
};

export const getAllProdutosLoja = async (req: Request, res: Response) => {
  const { lojaId } = req.params;
  try {
    const produtos = await prisma.produto.findMany({
      where: { lojaId: Number(lojaId) },
      include: {
        Loja: {
          select: {
            usuarioId: true,
          },
        },
      },
    });

    if (produtos.length < 0) {
      return res.status(204).json({ message: "Nenhum produto foi encontrado" });
    }

    return res.json(produtos);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro interno no servidor" });
  }
};

export const deleteManyProdutos = async (req: Request, res: Response) => {
  await prisma.produto.deleteMany();

  return res.status(204);
};

export const getUniqueProdutos = async (req: Request, res: Response) => {
  const { produtoId } = req.params;
  const produto = await prisma.produto.findUnique({
    where: { id: Number(produtoId) },
    select: {
      nome: true,
      img: true,
      preco: true,
      Loja: {
        select: {
          nome: true,
          usuarioId: true,
        },
      },
    },
  });

  return res.json(produto);
};
