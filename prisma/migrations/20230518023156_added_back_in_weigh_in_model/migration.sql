/*
  Warnings:

  - Added the required column `date` to the `WeighIn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `WeighIn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightProgress` to the `WeighIn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightToGoal` to the `WeighIn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightTotalChange` to the `WeighIn` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeighIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "weight" DECIMAL NOT NULL,
    "weightProgress" DECIMAL NOT NULL,
    "weightTotalChange" DECIMAL NOT NULL,
    "weightToGoal" DECIMAL NOT NULL,
    "bodyFatPercentage" DECIMAL,
    "bodyFatProgress" DECIMAL,
    "bodyFatTotalChange" DECIMAL,
    "previousWeighInId" TEXT
);
INSERT INTO "new_WeighIn" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "WeighIn";
DROP TABLE "WeighIn";
ALTER TABLE "new_WeighIn" RENAME TO "WeighIn";
CREATE UNIQUE INDEX "WeighIn_date_key" ON "WeighIn"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
