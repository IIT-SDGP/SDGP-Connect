/*
  Warnings:

  - The primary key for the `verificationtoken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `my_row_id` on the `verificationtoken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `verificationtoken` DROP PRIMARY KEY,
    DROP COLUMN `my_row_id`,
    ADD PRIMARY KEY (`identifier`, `token`);

-- CreateTable
CREATE TABLE `EmailOutbox` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `html` LONGTEXT NOT NULL,
    `status` ENUM('PENDING', 'SENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `lastError` TEXT NULL,
    `nextAttemptAt` DATETIME(3) NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `email_outbox_status_next_idx`(`status`, `nextAttemptAt`),
    INDEX `email_outbox_created_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectEdit` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `created_by_userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `reviewed_by_userId` VARCHAR(191) NULL,
    `reviewed_at` DATETIME(3) NULL,
    `rejected_reason` VARCHAR(191) NULL,
    `base_content_id` VARCHAR(191) NULL,
    `draft_snapshot` JSON NOT NULL,
    `changes` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProjectEdit_project_id_idx`(`project_id`),
    INDEX `ProjectEdit_created_by_userId_idx`(`created_by_userId`),
    INDEX `ProjectEdit_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectMetadata` ADD CONSTRAINT `ProjectMetadata_owner_userId_fkey` FOREIGN KEY (`owner_userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectEdit` ADD CONSTRAINT `ProjectEdit_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `ProjectMetadata`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectEdit` ADD CONSTRAINT `ProjectEdit_created_by_userId_fkey` FOREIGN KEY (`created_by_userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectEdit` ADD CONSTRAINT `ProjectEdit_reviewed_by_userId_fkey` FOREIGN KEY (`reviewed_by_userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
