/* Replace with your SQL commands */
CREATE TABLE `course_attend` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `course_Id` INT NOT NULL,
  `topic_id` INT NOT NULL,
  `attendAt` DATETIME NOT NULL DEFAULT NOW(),
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `description` VARCHAR(250) NULL,
  PRIMARY KEY (`id`));
