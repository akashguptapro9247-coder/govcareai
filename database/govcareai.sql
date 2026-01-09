-- GovCareAI Database Schema
-- Database: govcareai

CREATE DATABASE IF NOT EXISTS govcareai;
USE govcareai;

-- Table: citizens
CREATE TABLE citizens (
    citizen_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    gmail VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: admin
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    gmail VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Table: complaints
CREATE TABLE complaints (
    complaint_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(200),
    longitude DECIMAL(10, 8),
    latitude DECIMAL(11, 8),
    priority ENUM('HIGH', 'MODERATE', 'LOW') DEFAULT 'LOW',
    status ENUM('PENDING', 'IN PROGRESS', 'RESOLVED') DEFAULT 'PENDING',
    ai_score_text INT DEFAULT 0,
    ai_score_image INT DEFAULT 0,
    ai_score_location INT DEFAULT 0,
    ai_score_total DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE
);

-- Table: complaint_images
CREATE TABLE complaint_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- Table: complaint_messages
CREATE TABLE complaint_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    sender_type ENUM('ADMIN', 'CITIZEN') NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- Table: complaint_logs
CREATE TABLE complaint_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_citizens_gmail ON citizens(gmail);
CREATE INDEX idx_complaints_citizen_id ON complaints(citizen_id);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaint_images_complaint_id ON complaint_images(complaint_id);
CREATE INDEX idx_complaint_messages_complaint_id ON complaint_messages(complaint_id);