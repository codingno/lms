/* Replace with your SQL commands */
CREATE TABLE `course_grade` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NULL,
  `course_id` INT(11) NULL,
  `grade` DECIMAL(10,2) NULL,
  PRIMARY KEY (`id`));