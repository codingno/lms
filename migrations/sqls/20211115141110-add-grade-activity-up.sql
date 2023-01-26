/* Replace with your SQL commands */
ALTER TABLE `topic_activity_student` 
ADD COLUMN `grade` DECIMAL(10,2) NULL DEFAULT NULL AFTER `createdAt`;
