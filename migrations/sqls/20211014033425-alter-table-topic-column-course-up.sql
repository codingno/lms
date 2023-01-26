/* Replace with your SQL commands */
ALTER TABLE `topic` 
CHANGE COLUMN `course_category_id` `course_id` INT(11) NOT NULL
;
ALTER TABLE `topic` 
ADD CONSTRAINT `fk_topic_1`
  FOREIGN KEY (`course_id`)
  REFERENCES `courses` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
