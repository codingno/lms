/* Replace with your SQL commands */
ALTER TABLE `users` 
ADD COLUMN `code` VARCHAR(45) NULL DEFAULT NULL AFTER `username`;

ALTER TABLE `user_auth` 
CHANGE COLUMN `email` `email` VARCHAR(255) NOT NULL ,
CHANGE COLUMN `password` `password` VARCHAR(255) NULL DEFAULT NULL ;
