/* Replace with your SQL commands */
CREATE TABLE `topic_activity_student` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NULL,
  `topic_activity_id` INT(11) NULL,
  `attachment` VARCHAR(250) NULL,
  `createdAt` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`));