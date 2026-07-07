/*
  Warnings:

  - The primary key for the `award` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `excerpt` on the `blogpost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(191)`.
  - You are about to alter the column `rejectedReason` on the `blogpost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(191)`.
  - The primary key for the `competition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `award` DROP FOREIGN KEY `Award_accepted_by_fk`;

-- DropForeignKey
ALTER TABLE `award` DROP FOREIGN KEY `Award_competition_fk`;

-- DropForeignKey
ALTER TABLE `award` DROP FOREIGN KEY `Award_project_fk`;

-- DropForeignKey
ALTER TABLE `award` DROP FOREIGN KEY `Award_rejected_by_fk`;

-- DropForeignKey
ALTER TABLE `blogpost` DROP FOREIGN KEY `fk_blog_approved_by`;

-- DropForeignKey
ALTER TABLE `blogpost` DROP FOREIGN KEY `fk_blog_author`;

-- DropForeignKey
ALTER TABLE `blogpost` DROP FOREIGN KEY `fk_blog_rejected_by`;

-- DropForeignKey
ALTER TABLE `competition` DROP FOREIGN KEY `Competition_accepted_by_fk`;

-- DropForeignKey
ALTER TABLE `competition` DROP FOREIGN KEY `Competition_rejected_by_fk`;

-- DropForeignKey
ALTER TABLE `projectassociation` DROP FOREIGN KEY `ProjectAssociation_award_fk`;

-- DropForeignKey
ALTER TABLE `projectmetadata` DROP FOREIGN KEY `ProjectMetadata_featured_by_userId_fkey`;

-- DropForeignKey
ALTER TABLE `projectstatus` DROP FOREIGN KEY `ProjectStatus_approved_by_userId_fkey`;

-- DropIndex
DROP INDEX `user_id_index` ON `user`;

-- AlterTable
ALTER TABLE `award` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `competition_id` VARCHAR(191) NOT NULL,
    MODIFY `project_id` VARCHAR(191) NOT NULL,
    MODIFY `rejected_reason` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `blogauthor` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `blogpost` ADD COLUMN `module` VARCHAR(191) NULL,
    MODIFY `excerpt` VARCHAR(191) NOT NULL,
    MODIFY `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `rejectedReason` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `competition` DROP PRIMARY KEY,
    ADD COLUMN `module` VARCHAR(191) NULL,
    ADD COLUMN `projectsCompleted` INTEGER NULL,
    ADD COLUMN `schools` VARCHAR(191) NULL,
    ADD COLUMN `teamsParticipated` INTEGER NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `start_date` DATETIME(3) NOT NULL,
    MODIFY `end_date` DATETIME(3) NOT NULL,
    MODIFY `rejected_reason` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `projectassociation` MODIFY `projectType` ENUM('MOBILE', 'WEB', 'HARDWARE', 'DESKTOP', 'WEARABLE', 'EXTENSION') NULL,
    MODIFY `techStack` ENUM('REACT', 'ANGULAR', 'VUE', 'NODE', 'PYTHON', 'DJANGO', 'FLASK', 'JAVA', 'SPRING', 'DOTNET', 'PHP', 'LARAVEL', 'ANDROID', 'IOS', 'FLUTTER', 'REACT_NATIVE', 'FIREBASE', 'AWS', 'MONGODB', 'MYSQL', 'POSTGRESQL', 'TENSORFLOW', 'PYTORCH', 'ARDUINO', 'RASPBERRY_PI', 'SVELTE', 'KOTLIN', 'SWIFT', 'RUBY', 'JAVASCRIPT', 'TYPESCRIPT', 'C_SHARP', 'C_PLUS_PLUS', 'C') NULL,
    MODIFY `award_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `projectmetadata` ADD COLUMN `module` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `projectstatus` MODIFY `status` ENUM('IDEA', 'MVP', 'RESEARCH', 'DEPLOYED', 'STARTUP') NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `emailVerified` DATETIME(3) NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'MODERATOR', 'DEVELOPER', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMetadata` ADD CONSTRAINT `ProjectMetadata_featured_by_userId_fkey` FOREIGN KEY (`featured_by_userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStatus` ADD CONSTRAINT `ProjectStatus_approved_by_userId_fkey` FOREIGN KEY (`approved_by_userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectAssociation` ADD CONSTRAINT `ProjectAssociation_award_id_fkey` FOREIGN KEY (`award_id`) REFERENCES `Award`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Competition` ADD CONSTRAINT `Competition_accepted_by_id_fkey` FOREIGN KEY (`accepted_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Competition` ADD CONSTRAINT `Competition_rejected_by_id_fkey` FOREIGN KEY (`rejected_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Award` ADD CONSTRAINT `Award_competition_id_fkey` FOREIGN KEY (`competition_id`) REFERENCES `Competition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Award` ADD CONSTRAINT `Award_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `ProjectMetadata`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Award` ADD CONSTRAINT `Award_accepted_by_id_fkey` FOREIGN KEY (`accepted_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Award` ADD CONSTRAINT `Award_rejected_by_id_fkey` FOREIGN KEY (`rejected_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `BlogAuthor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_rejectedById_fkey` FOREIGN KEY (`rejectedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `award` RENAME INDEX `idx_award_accepted_by` TO `Award_accepted_by_id_idx`;

-- RenameIndex
ALTER TABLE `award` RENAME INDEX `idx_award_competition_id` TO `Award_competition_id_idx`;

-- RenameIndex
ALTER TABLE `award` RENAME INDEX `idx_award_project_id` TO `Award_project_id_idx`;

-- RenameIndex
ALTER TABLE `award` RENAME INDEX `idx_award_rejected_by` TO `Award_rejected_by_id_idx`;

-- RenameIndex
ALTER TABLE `blogauthor` RENAME INDEX `email` TO `BlogAuthor_email_key`;

-- RenameIndex
ALTER TABLE `blogpost` RENAME INDEX `approvedById` TO `BlogPost_approvedById_idx`;

-- RenameIndex
ALTER TABLE `blogpost` RENAME INDEX `authorId` TO `BlogPost_authorId_idx`;

-- RenameIndex
ALTER TABLE `blogpost` RENAME INDEX `publishedAt` TO `BlogPost_publishedAt_idx`;

-- RenameIndex
ALTER TABLE `blogpost` RENAME INDEX `rejectedById` TO `BlogPost_rejectedById_idx`;

-- RenameIndex
ALTER TABLE `competition` RENAME INDEX `idx_accepted_by` TO `Competition_accepted_by_id_idx`;

-- RenameIndex
ALTER TABLE `competition` RENAME INDEX `idx_rejected_by` TO `Competition_rejected_by_id_idx`;

-- RenameIndex
ALTER TABLE `projectassociation` RENAME INDEX `idx_project_association_award` TO `ProjectAssociation_award_id_idx`;
