/* Replace with your SQL commands */
ALTER TABLE `course_categories` 
DROP FOREIGN KEY `fk_course_categories_2`;
ALTER TABLE `categories` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;
ALTER TABLE `course_categories` 
ADD CONSTRAINT `fk_course_categories_2`
  FOREIGN KEY (`category`)
  REFERENCES `categories` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
