"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNivelAcesso = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNivelAcesso = async (req, res) => {
    const { nivelAcessoNome } = req.body;
    try {
        const novoNivelAcesso = await prisma.nivelAcesso.create({
            data: {
                nome: nivelAcessoNome,
            },
        });
        return res.json(novoNivelAcesso);
    }
    catch (error) {
        console.error(`Erro ao criar novo nível de acesso: ${error}`);
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.createNivelAcesso = createNivelAcesso;
