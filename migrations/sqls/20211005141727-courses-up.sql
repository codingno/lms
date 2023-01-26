/* Replace with your SQL commands */
CREATE TABLE `courses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `shortname` VARCHAR(45) NULL,
  `description` VARCHAR(45) NULL,
  `position` VARCHAR(45) NULL,
  `status` INT(11) NULL DEFAULT 1,
  PRIMARY KEY (`id`));
