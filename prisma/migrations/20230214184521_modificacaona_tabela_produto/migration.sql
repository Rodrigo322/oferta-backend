-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "lojaId" INTEGER,
    CONSTRAINT "Produto_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Produto" ("descricao", "id", "nome", "preco") SELECT "descricao", "id", "nome", "preco" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
