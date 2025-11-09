-- AMA-NICE CLOTHING Database Schema
-- 
-- This SQL file creates the products table for the AMA-NICE CLOTHING e-commerce site.
-- 
-- SETUP INSTRUCTIONS:
-- 1. Log into your Hostking cPanel
-- 2. Open phpMyAdmin
-- 3. Select your database (ama_nice_db)
-- 4. Click on the "SQL" tab
-- 5. Copy and paste this entire file
-- 6. Click "Go" to execute
-- 
-- Alternatively, you can run this via command line:
-- mysql -u your_username -p ama_nice_db < schema.sql

-- Create products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) DEFAULT NULL,
  `type` VARCHAR(100) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `gender` VARCHAR(50) DEFAULT NULL,
  `price` DECIMAL(10, 2) DEFAULT NULL,
  `price_range` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(255) NOT NULL,
  `stock_quantity` INT DEFAULT 0,
  `stock_number` VARCHAR(50) DEFAULT NULL,
  `size` VARCHAR(50) DEFAULT NULL,
  `is_shoe` TINYINT(1) DEFAULT 0,
  `shoe_brand` VARCHAR(100) DEFAULT NULL,
  `shoe_sizes` TEXT DEFAULT NULL COMMENT 'JSON array of shoe sizes with quantities',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for better query performance
  INDEX `idx_category` (`category`),
  INDEX `idx_type` (`type`),
  INDEX `idx_is_shoe` (`is_shoe`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example: Insert a test product (optional - remove after testing)
-- INSERT INTO products (type, category, price, price_range, description, image, stock_quantity, is_shoe) 
-- VALUES ('Test Product', 'men', 100.00, 'R50 - R150', 'This is a test product', 'Assets/images/test.jpg', 10, 0);

-- Verify table was created
-- SELECT * FROM products;

