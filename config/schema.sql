-- PIP Consulting Database Schema
-- Run this script to create all required tables

CREATE DATABASE IF NOT EXISTS pip_consulting;
USE pip_consulting;

-- Users table (Admin accounts)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'admin',
    avatar VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    subject VARCHAR(300),
    message TEXT NOT NULL,
    service_interest VARCHAR(200),
    is_read BOOLEAN DEFAULT FALSE,
    is_replied BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_name VARCHAR(100) NOT NULL,
    client_role VARCHAR(100),
    client_company VARCHAR(200),
    client_image VARCHAR(500),
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- Insert default admin user (password: Admin@123)
-- Note: This placeholder hash won't work. Run 'npm run setup' to create admin with proper password.
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@pipconsultinggroup.com', '$2b$10$placeholder', 'admin');

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_role, client_company, content, rating, is_featured, is_active, sort_order) VALUES
('Sarah Johnson', 'CEO', 'TechVentures Inc.', 'PIP Consulting transformed our digital strategy completely. Their team brought deep expertise and delivered exceptional results that exceeded our expectations.', 5, TRUE, TRUE, 1),
('Michael Chen', 'CFO', 'Global Manufacturing Corp', 'The financial advisory team helped us navigate a complex acquisition seamlessly. Their insights were invaluable in making critical decisions.', 5, TRUE, TRUE, 2),
('Emily Rodriguez', 'COO', 'HealthFirst Systems', 'Operations excellence at its finest. They identified inefficiencies we never knew existed and helped us save millions annually.', 5, TRUE, TRUE, 3),
('David Thompson', 'CTO', 'InnovateTech Solutions', 'Their digital transformation expertise helped us modernize our legacy systems while maintaining business continuity. Highly recommended.', 5, FALSE, TRUE, 4);
