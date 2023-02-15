"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLoja = exports.createLoja = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLoja = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao criar loja" });
    }
};
exports.createLoja = createLoja;
const getAllLoja = async (req, res) => {
    const loja = await prisma.loja.findMany();
    return res.json(loja);
};
exports.getAllLoja = getAllLoja;
