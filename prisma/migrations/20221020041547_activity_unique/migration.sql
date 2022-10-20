/*
  Warnings:

  - A unique constraint covering the columns `[activity]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activity_activity_key" ON "Activity"("activity");
