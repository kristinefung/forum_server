/*
  Warnings:

  - You are about to drop the column `UserRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserStatus` on the `User` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `UserRole`,
    DROP COLUMN `UserStatus`,
    ADD COLUMN `roleId` ENUM('ADMIN', 'USER') NOT NULL,
    ADD COLUMN `statusId` ENUM('NOT_VERIFIED', 'ACTIVE', 'DISABLED') NOT NULL;
