USE annotation_appBDD;
CREATE DATABASE IF NOT EXISTS annotation_appBDD;

DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT NULL,
    password VARCHAR(150) NOT NULL,
    role ENUM('annotator', 'admin') DEFAULT 'annotator',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticketName VARCHAR(50) DEFAULT NULL,
    description TEXT,
    sample VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DELIMITER //
CREATE TRIGGER trg_tickets_after_insert
AFTER INSERT ON tickets
FOR EACH ROW
BEGIN
  UPDATE tickets
  SET ticketName = CONCAT('ticket-', LPAD(NEW.id, 5, '0'))
  WHERE id = NEW.id;
END; //
DELIMITER ;

-- Insertion d'exemples d'utilisateurs
INSERT INTO users (nom, prenom, email, avatar, password, role)
VALUES (
  'admin', 
  'Jean', 
  'jean.admin@example.com', 
  'http://localhost:5000/uploads/avatars/admin.jpeg', 
  'qsd', 
  'admin'
);

INSERT INTO users (nom, prenom, email, avatar, password)
VALUES 
(
  'Hamilton', 
  'Lewis', 
  'lewis.hamilton@example.com', 
  'http://localhost:5000/uploads/avatars/shu.jpg', 
  'aze'
),
(
  'Cat', 
  'Silly', 
  'silly.cat@example.com', 
  'http://localhost:5000/uploads/avatars/shu.jpg', 
  'aze'
);
