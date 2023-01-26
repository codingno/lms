/* Replace with your SQL commands */
CREATE TABLE `user_auth` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `emailToken` VARCHAR(32) NULL DEFAULT NULL,
  `emailTokenExpired` DATETIME NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `resetPasswordToken` VARCHAR(32) NULL DEFAULT NULL,
  `resetPasswordExpired` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_auth_1_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_auth_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
