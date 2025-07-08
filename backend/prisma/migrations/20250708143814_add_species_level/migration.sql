/*
  Warnings:

  - Added the required column `updatedAt` to the `PokemonBuild` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PokemonBuild" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "level" INTEGER NOT NULL DEFAULT 50,
    "tier" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "item" TEXT,
    "nature" TEXT,
    "ability" TEXT,
    "hpIV" INTEGER NOT NULL DEFAULT 31,
    "attackIV" INTEGER NOT NULL DEFAULT 31,
    "defenseIV" INTEGER NOT NULL DEFAULT 31,
    "spAttackIV" INTEGER NOT NULL DEFAULT 31,
    "spDefenseIV" INTEGER NOT NULL DEFAULT 31,
    "speedIV" INTEGER NOT NULL DEFAULT 31,
    "hpEV" INTEGER NOT NULL DEFAULT 0,
    "attackEV" INTEGER NOT NULL DEFAULT 0,
    "defenseEV" INTEGER NOT NULL DEFAULT 0,
    "spAttackEV" INTEGER NOT NULL DEFAULT 0,
    "spDefenseEV" INTEGER NOT NULL DEFAULT 0,
    "speedEV" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PokemonBuild" ("ability", "createdAt", "id", "item", "moves", "name", "nature", "tier") SELECT "ability", "createdAt", "id", "item", "moves", "name", "nature", "tier" FROM "PokemonBuild";
DROP TABLE "PokemonBuild";
ALTER TABLE "new_PokemonBuild" RENAME TO "PokemonBuild";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
