-- AlterTable
ALTER TABLE "PokemonBuild" ADD COLUMN "gender" TEXT;

-- CreateTable
CREATE TABLE "ShinyHunt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pokemonId" INTEGER NOT NULL,
    "pokemonName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phaseCount" INTEGER NOT NULL DEFAULT 1,
    "totalEncounters" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "phasePokemon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShinyPortfolio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pokemonId" INTEGER NOT NULL,
    "pokemonName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "dateFound" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nature" TEXT,
    "encounterCount" INTEGER,
    "hpIV" INTEGER,
    "attackIV" INTEGER,
    "defenseIV" INTEGER,
    "spAttackIV" INTEGER,
    "spDefenseIV" INTEGER,
    "speedIV" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
