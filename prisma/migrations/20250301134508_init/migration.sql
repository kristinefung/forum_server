-- AlterTable
ALTER TABLE `Otp` MODIFY `isUsed` TINYINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `UserLoginLog` MODIFY `sessionToken` VARCHAR(191) NOT NULL;
