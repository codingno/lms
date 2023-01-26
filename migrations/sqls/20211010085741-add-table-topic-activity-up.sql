/* Replace with your SQL commands */
CREATE TABLE topic_activity (
  id INT NOT NULL AUTO_INCREMENT,
  topic_id INT NULL,
  activity INT NULL,
  attachment VARCHAR(200) NULL,
  createdAt DATETIME NULL DEFAULT NOW(),
  createdBy INT NULL,
  updatedAt DATETIME NULL,
  updatedBy INT NULL,
  PRIMARY KEY (id));