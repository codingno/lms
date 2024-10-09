/* Replace with your SQL commands */
ALTER TABLE `topic_activity` 
CHANGE COLUMN `activity` `activity_id` INT(11) NULL DEFAULT NULL 
;
ALTER TABLE `topic_activity` 
ADD CONSTRAINT `fk_topic_activity_1`
  FOREIGN KEY (`topic_id`)
  REFERENCES `topic` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_topic_activity_2`
  FOREIGN KEY (`activity_id`)
  REFERENCES `activity` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
