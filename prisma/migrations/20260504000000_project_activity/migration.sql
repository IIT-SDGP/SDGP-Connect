-- CreateTable
CREATE TABLE `ProjectActivity` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `actor_userId` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `message` TEXT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_activity_project_created_idx`(`project_id`, `createdAt`),
    INDEX `project_activity_actor_created_idx`(`actor_userId`, `createdAt`),
    INDEX `ProjectActivity_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectActivity` ADD CONSTRAINT `ProjectActivity_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `ProjectMetadata`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectActivity` ADD CONSTRAINT `ProjectActivity_actor_userId_fkey` FOREIGN KEY (`actor_userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Best-effort backfill for existing project state. This preserves current known state;
-- future transitions are appended by the application routes.
INSERT INTO `ProjectActivity` (`id`, `project_id`, `actor_userId`, `type`, `message`, `metadata`, `createdAt`)
SELECT UUID(), pc.`metadata_id`, pm.`owner_userId`, 'PROJECT_SUBMITTED', NULL, JSON_OBJECT('source', 'migration_backfill'), ps.`createdAt`
FROM `ProjectStatus` ps
JOIN `ProjectContent` pc ON pc.`content_id` = ps.`content_id`
JOIN `ProjectMetadata` pm ON pm.`project_id` = pc.`metadata_id`;

INSERT INTO `ProjectActivity` (`id`, `project_id`, `actor_userId`, `type`, `message`, `metadata`, `createdAt`)
SELECT UUID(), pc.`metadata_id`, ps.`approved_by_userId`, 'PROJECT_APPROVED', NULL, JSON_OBJECT('source', 'migration_backfill'), COALESCE(ps.`approved_at`, ps.`updatedAt`)
FROM `ProjectStatus` ps
JOIN `ProjectContent` pc ON pc.`content_id` = ps.`content_id`
WHERE ps.`approved_status` = 'APPROVED';

INSERT INTO `ProjectActivity` (`id`, `project_id`, `actor_userId`, `type`, `message`, `metadata`, `createdAt`)
SELECT UUID(), pc.`metadata_id`, ps.`approved_by_userId`, 'PROJECT_REJECTED', ps.`rejected_reason`, JSON_OBJECT('source', 'migration_backfill'), COALESCE(ps.`approved_at`, ps.`updatedAt`)
FROM `ProjectStatus` ps
JOIN `ProjectContent` pc ON pc.`content_id` = ps.`content_id`
WHERE ps.`approved_status` = 'REJECTED';

INSERT INTO `ProjectActivity` (`id`, `project_id`, `actor_userId`, `type`, `message`, `metadata`, `createdAt`)
SELECT UUID(), pe.`project_id`, pe.`created_by_userId`, 'EDIT_SUBMITTED', NULL, JSON_OBJECT('source', 'migration_backfill', 'editId', pe.`id`), pe.`createdAt`
FROM `ProjectEdit` pe;

INSERT INTO `ProjectActivity` (`id`, `project_id`, `actor_userId`, `type`, `message`, `metadata`, `createdAt`)
SELECT UUID(), pe.`project_id`, pe.`reviewed_by_userId`, 'EDIT_APPROVED', NULL, JSON_OBJECT('source', 'migration_backfill', 'editId', pe.`id`), COALESCE(pe.`reviewed_at`, pe.`updatedAt`)
FROM `ProjectEdit` pe
WHERE pe.`status` = 'APPROVED';

INSERT INTO `ProjectActivity` (`id`, `project_id`, `actor_userId`, `type`, `message`, `metadata`, `createdAt`)
SELECT UUID(), pe.`project_id`, pe.`reviewed_by_userId`, 'EDIT_REJECTED', pe.`rejected_reason`, JSON_OBJECT('source', 'migration_backfill', 'editId', pe.`id`), COALESCE(pe.`reviewed_at`, pe.`updatedAt`)
FROM `ProjectEdit` pe
WHERE pe.`status` = 'REJECTED';
