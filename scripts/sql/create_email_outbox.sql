CREATE TABLE IF NOT EXISTS `EmailOutbox` (
  `id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `to` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(191) NOT NULL,
  `html` LONGTEXT NOT NULL,
  `status` ENUM('PENDING','SENDING','SENT','FAILED') NOT NULL DEFAULT 'PENDING',
  `attempts` INT NOT NULL DEFAULT 0,
  `lastError` TEXT NULL,
  `nextAttemptAt` DATETIME(3) NULL,
  `meta` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `email_outbox_status_next_idx` (`status`, `nextAttemptAt`),
  INDEX `email_outbox_created_idx` (`createdAt`)
) DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

