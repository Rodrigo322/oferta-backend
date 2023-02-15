"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const login = async (req, res) => {
    const { email, senha } = req.body;
    // Verifica as credenciais do usuário
    const user = await prisma.usuario.findUnique({
        where: {
            email,
        },
    });
    if (!user || user.senha !== senha) {
        return res.status(401).json({ message: "Credenciais inválidas" });
    }
    // Gera o token de autenticação
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, "secret");
    return res.json({ token });
};
exports.login = login;
