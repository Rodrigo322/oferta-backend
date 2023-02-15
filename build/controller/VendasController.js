"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realizarVenda = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const realizarVenda = async (req, res) => {
    const { produtosIds, usuarioVendedorId, usuarioCompradorId } = req.body;
    try {
        // Busca os produtos selecionados pelo usuário
        const produtos = await prisma.produto.findMany({
            where: {
                id: { in: produtosIds },
            },
        });
        // Calcula o valor total da venda
        const valorTotal = produtos.reduce((total, produto) => total + produto.preco, 0);
        // Cria a venda no banco de dados
        const venda = await prisma.venda.create({
            data: {
                valor_total: valorTotal,
                data: new Date(),
                usuario_vendedor: { connect: { id: usuarioVendedorId } },
                usuario_comprador: { connect: { id: usuarioCompradorId } },
                produtos: {
                    create: produtos.map((produto) => ({
                        produto: { connect: { id: produto.id } },
                        quantidade: 1,
                    })),
                },
            },
            include: {
                produtos: true,
            },
        });
        res.status(200).json({ message: "Venda realizada com sucesso", venda });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocorreu um erro ao realizar a venda" });
    }
};
exports.realizarVenda = realizarVenda;
