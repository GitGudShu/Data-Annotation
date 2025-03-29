CREATE DATABASE IF NOT EXISTS annotation_appBDD;
USE annotation_appBDD;

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

-- Admin: Jean Admin
INSERT INTO users (nom, prenom, email, avatar, password, role)
VALUES (
  'admin', 
  'Jean', 
  'jean.admin@example.com', 
  'http://localhost:5000/uploads/avatars/admin.jpeg', 
  'qsd', 
  'admin'
);

-- Annotator: Lewis Hamilton and Silly Cat
INSERT INTO users (nom, prenom, email, avatar, password)
VALUES (
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
