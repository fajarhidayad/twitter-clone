/*
  Warnings:

  - You are about to drop the column `sourceId` on the `Tweet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tweet` DROP FOREIGN KEY `Tweet_sourceId_fkey`;

-- AlterTable
ALTER TABLE `Tweet` DROP COLUMN `sourceId`,
    ADD COLUMN `retweetFromId` INTEGER NULL,
    ADD COLUMN `sourceTweetId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Tweet` ADD CONSTRAINT `Tweet_retweetFromId_fkey` FOREIGN KEY (`retweetFromId`) REFERENCES `Tweet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tweet` ADD CONSTRAINT `Tweet_sourceTweetId_fkey` FOREIGN KEY (`sourceTweetId`) REFERENCES `Tweet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
