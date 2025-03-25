CREATE DATABASE IF NOT EXISTS annotation_appBDD;
USE annotation_appBDD;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role ENUM('annotateur', 'admin') DEFAULT 'annotateur'
);