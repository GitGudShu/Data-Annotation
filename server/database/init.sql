CREATE DATABASE IF NOT EXISTS annotation_appBDD;
USE annotation_appBDD;

DROP TABLE IF EXISTS `users`;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(150) NOT NULL,
    role ENUM('annotator', 'admin') DEFAULT 'annotator',
    createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;