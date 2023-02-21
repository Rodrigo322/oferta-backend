import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
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
  try {
    const nivelAcesso = await prisma.nivelAcesso.findUnique({
      where: {
        nome: nivelAcessoNome,
      },
    });

    if (!nivelAcesso) {
      throw new Error(`Nível de acesso ${nivelAcessoNome} não existe`);
    }
    const passwordHash = await hash(senha, 8);

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: passwordHash,
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

export const updateUser = async (req: Request, res: Response) => {
  const { nome, email, cpf } = req.body;
  const { id } = req.user;

  const user = await prisma.usuario.update({
    where: {
      id,
    },
    data: {
      nome,
      email,
      cpf,
    },
  });

  return res.json({ user });
};

export const getUniqueUser = async (req: Request, res: Response) => {
  const { id } = req.user;

  const user = await prisma.usuario.findUnique({
    where: { id },
  });

  return res.json(user);
};
