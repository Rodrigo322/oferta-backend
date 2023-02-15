import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
