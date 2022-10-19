/*
  Warnings:

  - You are about to drop the `ActivitiesOnEntries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivitiesOnEntries" DROP CONSTRAINT "ActivitiesOnEntries_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ActivitiesOnEntries" DROP CONSTRAINT "ActivitiesOnEntries_entryId_fkey";

-- DropTable
DROP TABLE "ActivitiesOnEntries";

-- CreateTable
CREATE TABLE "_ActivityToEntry" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToEntry_AB_unique" ON "_ActivityToEntry"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToEntry_B_index" ON "_ActivityToEntry"("B");

-- AddForeignKey
ALTER TABLE "_ActivityToEntry" ADD CONSTRAINT "_ActivityToEntry_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToEntry" ADD CONSTRAINT "_ActivityToEntry_B_fkey" FOREIGN KEY ("B") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
