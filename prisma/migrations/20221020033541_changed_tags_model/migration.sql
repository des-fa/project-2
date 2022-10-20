/*
  Warnings:

  - You are about to drop the column `tag` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "tag";

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
