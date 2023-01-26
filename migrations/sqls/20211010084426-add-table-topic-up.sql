/* Replace with your SQL commands */
CREATE TABLE topic (
  id INT NOT NULL AUTO_INCREMENT,
  course_category_id INT NULL,
  name VARCHAR(100) NULL,
  createdAt DATETIME NULL DEFAULT NOW(),
  createdBy INT NULL,
  updatedAt DATETIME NULL,
  updatedBy INT NULL,
  startDate DATETIME NULL,
  endDate DATETIME NULL,
  PRIMARY KEY (id));