"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
function authMiddleware(permissions) {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token não fornecido" });
        }
        const token = authHeader.substring(7);
        try {
            const decodedToken = (0, jsonwebtoken_1.verify)(token, "secret");
            req.user = { id: decodedToken.userId };
            // Verifica as permissões do usuário
            if (permissions) {
                const user = await prisma.usuario.findUnique({
                    where: {
                        id: decodedToken.userId,
                    },
                    include: {
                        NivelAcesso: true,
                    },
                });
                const userPermissions = user?.NivelAcesso.map((na) => na.nome) ?? [];
                const hasPermission = permissions.some((p) => userPermissions.includes(p));
                if (!hasPermission) {
                    return res.status(403).json({ message: "Permissão negada" });
                }
            }
            return next();
        }
        catch (err) {
            return res.status(401).json({ message: "Token inválido" });
        }
    };
}
exports.authMiddleware = authMiddleware;
