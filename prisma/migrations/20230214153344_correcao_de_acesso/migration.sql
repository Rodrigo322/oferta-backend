/*
  Warnings:

  - You are about to drop the column `nivelAcessoId` on the `Usuario` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "NivelAcessoUsuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "nivelAcessoId" INTEGER NOT NULL,
    CONSTRAINT "NivelAcessoUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NivelAcessoUsuario_nivelAcessoId_fkey" FOREIGN KEY ("nivelAcessoId") REFERENCES "NivelAcesso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_NivelAcessoToUsuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_NivelAcessoToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "NivelAcesso" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_NivelAcessoToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_Usuario" ("email", "id", "nome", "senha") SELECT "email", "id", "nome", "senha" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_NivelAcessoToUsuario_AB_unique" ON "_NivelAcessoToUsuario"("A", "B");

-- CreateIndex
CREATE INDEX "_NivelAcessoToUsuario_B_index" ON "_NivelAcessoToUsuario"("B");
