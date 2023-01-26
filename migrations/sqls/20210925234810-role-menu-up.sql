/* Replace with your SQL commands */
CREATE TABLE `role_menu` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `role_id` INT(11) NULL,
  `menu_id` INT(11) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_role_menu_role_idx` (`role_id` ASC),
  INDEX `fk_role_menu_menu_idx` (`menu_id` ASC),
  CONSTRAINT `fk_role_menu_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_role_menu_menu`
    FOREIGN KEY (`menu_id`)
    REFERENCES `menu` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
