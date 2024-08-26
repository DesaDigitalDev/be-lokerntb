/*
  Warnings:

  - You are about to drop the `bidangusaha` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bidangusaha` DROP FOREIGN KEY `Bidangusaha_userId_fkey`;

-- DropTable
DROP TABLE `bidangusaha`;
