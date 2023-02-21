import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  try {
    const user = await prisma.usuario.findUnique({
      where: {
        email,
      },
      include: {
        NivelAcesso: {
          select: {
            nome: true,
          },
        },
      },
    });

    if (!user) {
      return res.json({ error: "user not found" });
    }

    const isPasswordValid = await compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.json({ error: "password invalid" });
    }

    // Gera o token de autenticação
    const token = sign({ userId: user.id, role: user.NivelAcesso }, "secret", {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
