-- Create the BlogAuthor table
CREATE TABLE `BlogAuthor` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `avatarUrl` VARCHAR(191),
  `instagram` VARCHAR(191),
  `twitter` VARCHAR(191),
  `facebook` VARCHAR(191),
  `linkedin` VARCHAR(191),
  `medium` VARCHAR(191),
  `website` VARCHAR(191),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Create the BlogPost table
CREATE TABLE `BlogPost` (
  `id`           VARCHAR(191) NOT NULL PRIMARY KEY,
  `title`        VARCHAR(191) NOT NULL,
  `excerpt`      VARCHAR(512) NOT NULL,
  `content`      LONGTEXT      NOT NULL,
  `imageUrl`     VARCHAR(191),
  `publishedAt`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `authorId`     VARCHAR(191)  NOT NULL,
  `category`     ENUM(
    'AI','ML','AR_VR','BLOCKCHAIN','IOT','HEALTHTECH','FINTECH','EDTECH',
    'AGRITECH','ECOMMERCE','SOCIAL','GAMING','SECURITY','DATA_ANALYTICS',
    'ENTERTAINMENT','SUSTAINABILITY'
  ) NOT NULL,
  `featured`     BOOLEAN       NOT NULL DEFAULT FALSE,
  `approved`     BOOLEAN       NOT NULL DEFAULT FALSE,
  `approvedById` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `rejectedById` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `rejectedReason` VARCHAR(512),
  `createdAt`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX (`authorId`),
  INDEX (`publishedAt`),
  INDEX (`approvedById`),
  INDEX (`rejectedById`),

  CONSTRAINT `fk_blog_author`
    FOREIGN KEY (`authorId`) REFERENCES `BlogAuthor`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blog_approved_by`
    FOREIGN KEY (`approvedById`) REFERENCES `User`(`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blog_rejected_by`
    FOREIGN KEY (`rejectedById`) REFERENCES `User`(`user_id`) ON DELETE SET NULL
);
