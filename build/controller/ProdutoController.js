"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProdutosLoja = exports.getAllProdutos = exports.createProduto = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProduto = async (req, res) => {
    const { nome, descricao, preco, quantidade } = req.body;
    const { lojaId } = req.params;
    const { id } = req.user;
    const requestImage = req.file;
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
            img: requestImage.originalname,
            Loja: {
                connect: {
                    id: Number(lojaId),
                },
            },
        },
    });
    return res.json(createdProduto);
};
exports.createProduto = createProduto;
const getAllProdutos = async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany();
        if (produtos.length < 0) {
            return res.status(204).json({ message: "Nenhum produto foi encontrado" });
        }
        return res.json(produtos);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Ocorreu um erro interno no servidor" });
    }
};
exports.getAllProdutos = getAllProdutos;
const getAllProdutosLoja = async (req, res) => {
    const { lojaId } = req.params;
    try {
        const produtos = await prisma.produto.findMany({
            where: { lojaId: Number(lojaId) },
        });
        if (produtos.length > 0) {
            return res.status(204).json({ message: "Nenhum produto foi encontrado" });
        }
        return res.json(produtos);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Ocorreu um erro interno no servidor" });
    }
};
exports.getAllProdutosLoja = getAllProdutosLoja;
