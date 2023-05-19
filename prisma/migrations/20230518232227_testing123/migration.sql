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
    "previousWeighInId" TEXT,
    "userid" TEXT NOT NULL DEFAULT 'PHIL'
);
INSERT INTO "new_WeighIn" ("bodyFatPercentage", "bodyFatProgress", "bodyFatTotalChange", "createdAt", "date", "id", "previousWeighInId", "updatedAt", "weight", "weightProgress", "weightToGoal", "weightTotalChange") SELECT "bodyFatPercentage", "bodyFatProgress", "bodyFatTotalChange", "createdAt", "date", "id", "previousWeighInId", "updatedAt", "weight", "weightProgress", "weightToGoal", "weightTotalChange" FROM "WeighIn";
DROP TABLE "WeighIn";
ALTER TABLE "new_WeighIn" RENAME TO "WeighIn";
CREATE UNIQUE INDEX "WeighIn_date_key" ON "WeighIn"("date");
CREATE TABLE "new_Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DECIMAL NOT NULL,
    "userid" TEXT NOT NULL DEFAULT 'PHIL'
);
INSERT INTO "new_Goal" ("createdAt", "id", "updatedAt", "weight") SELECT "createdAt", "id", "updatedAt", "weight" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
CREATE UNIQUE INDEX "Goal_userid_key" ON "Goal"("userid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
