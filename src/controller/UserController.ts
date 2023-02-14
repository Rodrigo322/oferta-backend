import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CreateUserInput {
  nome: string;
  email: string;
  senha: string;
  nivelAcessoNome: string;
}

export const createNivelAcesso = async () => {
  try {
    const novoNivelAcesso = await prisma.nivelAcesso.create({
      data: {
        nome: "Vendedor",
      },
    });
    console.log(`Novo nível de acesso criado com o ID: ${novoNivelAcesso.id}`);
  } catch (error) {
    console.error(`Erro ao criar novo nível de acesso: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { nome, email, senha, nivelAcessoNome } = req.body as CreateUserInput;
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
