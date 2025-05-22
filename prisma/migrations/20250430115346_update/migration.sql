/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `moderationNote` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "imageUrl",
DROP COLUMN "moderationNote",
ADD COLUMN     "imageUrls" TEXT[];
