/* Replace with your SQL commands */
ALTER TABLE `courses` 
ADD COLUMN `image_url` VARCHAR(255) NULL DEFAULT NULL AFTER `description`;
