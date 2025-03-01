/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `User` table. All the data in the column will be lost.
  - Added the required column `UserRole` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserStatus` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `roleId`,
    DROP COLUMN `statusId`,
    ADD COLUMN `UserRole` VARCHAR(191) NOT NULL,
    ADD COLUMN `UserStatus` VARCHAR(191) NOT NULL;
