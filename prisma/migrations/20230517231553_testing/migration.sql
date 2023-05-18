-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeighIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DECIMAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WeighIn_date_key" ON "WeighIn"("date");
