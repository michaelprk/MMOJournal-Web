-- CreateTable
CREATE TABLE "PokemonBuild" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "item" TEXT,
    "nature" TEXT,
    "ability" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
