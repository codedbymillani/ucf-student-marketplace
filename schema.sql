-- Drop database if it exists to start fresh
DROP DATABASE IF EXISTS ucf_marketplace;
CREATE DATABASE ucf_marketplace;
USE ucf_marketplace;

-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Will store BCrypt hashes
    contact_handle VARCHAR(100) NOT NULL, -- e.g., @snapchat, @instagram
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Listings Table
CREATE TABLE listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    category ENUM('Housing', 'Textbooks', 'Electronics', 'Clothing', 'Other') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    complex_name VARCHAR(100) DEFAULT NULL, -- Specific to Housing
    layout_type VARCHAR(20) DEFAULT NULL,    -- Specific to Housing (e.g., 4x4)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Indices for optimized searching and filtering
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_price ON listings(price);

-- Insert Mock Data for Testing (Password hash represents 'password123' via BCrypt)
INSERT INTO users (username, email, password_hash, contact_handle) VALUES 
('knight_crawler', 'knight1@knights.ucf.edu', '$2a$10$vI8A7clA/8EIs.6xT4N8p.tOOmLq7Z.SgB0N88Wp/v4m3K1vA2V2m', '@knight_snap'),
('gold_rusher', 'rusher@knights.ucf.edu', '$2a$10$vI8A7clA/8EIs.6xT4N8p.tOOmLq7Z.SgB0N88Wp/v4m3K1vA2V2m', '@gold_ig');

INSERT INTO listings (user_id, title, category, price, description, complex_name, layout_type) VALUES 
(1, 'Summer Sublease at Plaza', 'Housing', 850.00, 'Looking for someone to take over my room for the summer. Great roommates.', 'Plaza on University', '4x4'),
(2, 'Intro to C Textbook', 'Textbooks', 45.00, 'Slightly used textbook for COP 3223. No annotations inside.', NULL, NULL),
(1, 'iPad Air 4th Gen', 'Electronics', 350.00, 'Perfect condition, comes with charger and a case.', NULL, NULL);
