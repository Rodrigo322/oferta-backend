"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.listUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listUser = async (req, res) => {
    const listUser = await prisma.usuario.findMany({
        include: {
            NivelAcesso: true,
        },
    });
    return res.json(listUser);
};
exports.listUser = listUser;
const createUser = async (req, res) => {
    const { nome, email, senha, nivelAcessoNome, cpf } = req.body;
    const nivelAcesso = await prisma.nivelAcesso.findUnique({
        where: {
            nome: nivelAcessoNome,
        },
    });
    if (!nivelAcesso) {
        throw new Error(`Nível de acesso ${nivelAcessoNome} não existe`);
    }
    try {
        // Cria o usuário com nível de acesso "comprador"
        const user = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha,
                cpf,
                NivelAcesso: {
                    connect: {
                        id: nivelAcesso.id,
                    },
                },
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar usuário");
    }
};
exports.createUser = createUser;
