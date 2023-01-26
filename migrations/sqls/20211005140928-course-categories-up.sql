/* Replace with your SQL commands */
CREATE TABLE `categories` (
  `id` INT(11) NOT NULL,
  `code` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NULL,
  `parent` INT(11) NULL,
  `position` INT(11) NULL,
  `status` TINYINT(1) NULL DEFAULT 1,
  PRIMARY KEY (`id`));
