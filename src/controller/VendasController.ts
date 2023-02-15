import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const realizarVenda = async (req: Request, res: Response) => {
  const { produtos, usuarioVendedorId, usuarioCompradorId } = req.body;

  try {
    // Busca os produtos selecionados pelo usuário
    const produtosDoBanco = await prisma.produto.findMany({
      where: {
        id: { in: produtos.map((produto: any) => produto.id) },
      },
    });

    // Adiciona a quantidade de cada produto selecionado
    const produtosComQuantidade = produtosDoBanco.map((produto) => {
      const { id, nome, preco } = produto;
      const quantidade = produtos.find(
        (p: any) => p.id === produto.id
      ).quantidade;
      return {
        id,
        nome,
        preco,
        quantidade,
      };
    });

    // Calcula o valor total da venda
    let valorTotal = 0;
    for (const produto of produtosComQuantidade) {
      valorTotal += produto.preco * parseInt(produto.quantidade);
    }

    // Cria a venda no banco de dados
    const venda = await prisma.venda.create({
      data: {
        valor_total: valorTotal,
        data: new Date(),
        usuario_vendedor: { connect: { id: usuarioVendedorId } },
        usuario_comprador: { connect: { id: usuarioCompradorId } },
        produtos: {
          create: produtosComQuantidade.map((produto) => ({
            produto: { connect: { id: produto.id } },
            quantidade: produto.quantidade,
          })),
        },
      },
      include: {
        produtos: true,
      },
    });

    // Atualiza a quantidade de cada produto vendido na tabela de produtos

    produtosComQuantidade.map(async (produto) => {
      await prisma.produto.updateMany({
        where: { id: produto.id },
        data: {
          quantidade: {
            decrement: parseInt(produto.quantidade),
          },
        },
      });
    });

    res.status(200).json({ message: "Venda realizada com sucesso", venda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocorreu um erro ao realizar a venda" });
  }
};
