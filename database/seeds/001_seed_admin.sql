-- Seed: Initial admin user
-- Date: 2025-12-22

-- Insert default admin user
-- Email: admin@govcareai.com
-- Password: Admin@123 (hashed using bcrypt)
INSERT INTO admin (full_name, gmail, password_hash) VALUES 
('System Administrator', 'admin@govcareai.com', '$2b$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO');