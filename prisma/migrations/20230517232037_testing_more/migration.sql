/*
  Warnings:

  - You are about to drop the column `date` on the `WeighIn` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `WeighIn` table. All the data in the column will be lost.
  - You are about to drop the column `weightProgress` on the `WeighIn` table. All the data in the column will be lost.
  - You are about to drop the column `weightToGoal` on the `WeighIn` table. All the data in the column will be lost.
  - You are about to drop the column `weightTotalChange` on the `WeighIn` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeighIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WeighIn" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "WeighIn";
DROP TABLE "WeighIn";
ALTER TABLE "new_WeighIn" RENAME TO "WeighIn";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
