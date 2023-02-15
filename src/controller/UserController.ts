import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CreateUserInput {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  nivelAcessoNome: string;
}

export const listUser = async (req: Request, res: Response) => {
  const listUser = await prisma.usuario.findMany({
    include: {
      NivelAcesso: true,
    },
  });

  return res.json(listUser);
};

export const createUser = async (req: Request, res: Response) => {
  const { nome, email, senha, nivelAcessoNome, cpf } =
    req.body as CreateUserInput;
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar usuário");
  }
};
