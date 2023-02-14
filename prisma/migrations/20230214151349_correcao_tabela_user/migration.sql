/*
  Warnings:

  - You are about to drop the `_NivelAcessoToUsuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_NivelAcessoToUsuario_B_index";

-- DropIndex
DROP INDEX "_NivelAcessoToUsuario_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_NivelAcessoToUsuario";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nivelAcessoId" INTEGER,
    CONSTRAINT "Usuario_nivelAcessoId_fkey" FOREIGN KEY ("nivelAcessoId") REFERENCES "NivelAcesso" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("email", "id", "nome", "senha") SELECT "email", "id", "nome", "senha" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
