/*
  Warnings:

  - You are about to alter the column `UserRole` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `UserStatus` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `UserRole` ENUM('ADMIN', 'USER') NOT NULL,
    MODIFY `UserStatus` ENUM('NOT_VERIFIED', 'ACTIVE', 'DISABLED') NOT NULL;
