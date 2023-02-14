/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `NivelAcesso` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NivelAcesso_nome_key" ON "NivelAcesso"("nome");
