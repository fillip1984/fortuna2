/*
  Warnings:

  - You are about to drop the column `bodyFatPercentage` on the `WeighIn` table. All the data in the column will be lost.
  - You are about to drop the column `bodyFatProgress` on the `WeighIn` table. All the data in the column will be lost.
  - You are about to drop the column `bodyFatTotalChange` on the `WeighIn` table. All the data in the column will be lost.
  - You are about to drop the column `previousWeighInId` on the `WeighIn` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeighIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATETIME NOT NULL,
    "weight" DECIMAL NOT NULL,
    "weightProgress" DECIMAL NOT NULL,
    "weightTotalChange" DECIMAL NOT NULL,
    "weightToGoal" DECIMAL NOT NULL
);
INSERT INTO "new_WeighIn" ("createdAt", "date", "id", "updatedAt", "weight", "weightProgress", "weightToGoal", "weightTotalChange") SELECT "createdAt", "date", "id", "updatedAt", "weight", "weightProgress", "weightToGoal", "weightTotalChange" FROM "WeighIn";
DROP TABLE "WeighIn";
ALTER TABLE "new_WeighIn" RENAME TO "WeighIn";
CREATE UNIQUE INDEX "WeighIn_date_key" ON "WeighIn"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
