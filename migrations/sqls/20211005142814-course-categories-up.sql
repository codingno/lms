/* Replace with your SQL commands */
CREATE TABLE `course_categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `course` INT(11) NOT NULL,
  `category` INT(11) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NULL DEFAULT NOW(),
  `createdBy` INT(11) NOT NULL,
  `updatedAt` DATETIME NULL,
  `updatedBy` INT(11) NULL,
  `startDate` DATETIME NULL,
  `endDate` DATETIME NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_course_categories_1`
    FOREIGN KEY (`course`)
    REFERENCES `courses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_course_categories_2`
    FOREIGN KEY (`category`)
    REFERENCES `categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
