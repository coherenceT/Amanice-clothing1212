# MySQL Database Setup Guide for AMA-NICE CLOTHING

This guide will help you set up the MySQL database for the AMA-NICE CLOTHING e-commerce site on Hostking hosting.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Database in Hostking cPanel](#step-1-create-database-in-hostking-cpanel)
4. [Step 2: Create Database User](#step-2-create-database-user)
5. [Step 3: Assign User to Database](#step-3-assign-user-to-database)
6. [Step 4: Configure Database Connection](#step-4-configure-database-connection)
7. [Step 5: Create Database Table](#step-5-create-database-table)
8. [Step 6: Test the Setup](#step-6-test-the-setup)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The AMA-NICE CLOTHING site now uses MySQL database instead of browser localStorage for product storage. This provides:

- ✅ Permanent storage (data persists even if browser is cleared)
- ✅ Shared visibility across all users/devices
- ✅ Better performance for large product catalogs
- ✅ Professional data management

---

## 📦 Prerequisites

- Hostking hosting account with cPanel access
- MySQL database access enabled
- FTP/File Manager access to upload files
- Basic knowledge of cPanel navigation

---

## 📝 Step 1: Create Database in Hostking cPanel

1. **Log into Hostking cPanel**
   - Go to your Hostking account
   - Log in with your credentials
   - Navigate to cPanel

2. **Find MySQL Databases**
   - In cPanel, scroll down to the "Databases" section
   - Click on "MySQL Databases" or "MySQL Database Wizard"

3. **Create New Database**
   - Enter database name: `ama_nice_db` (or your preferred name)
   - Click "Create Database"
   - Note: Hostking may prefix your database name (e.g., `username_ama_nice_db`)
   - **Remember the full database name** (including prefix)

---

## 👤 Step 2: Create Database User

1. **Scroll to "MySQL Users" section**
   - In the same MySQL Databases page
   - Find "Add New User" section

2. **Create User**
   - Username: `ama_nice_user` (or your preferred name)
   - Password: Create a strong password (use password generator)
   - Click "Create User"
   - **Note:** Hostking may prefix your username (e.g., `username_ama_nice_user`)
   - **Remember the full username and password**

---

## 🔗 Step 3: Assign User to Database

1. **Add User to Database**
   - Scroll to "Add User to Database" section
   - Select the user you just created from dropdown
   - Select the database you created from dropdown
   - Click "Add"

2. **Set Privileges**
   - Check "ALL PRIVILEGES" (or at minimum: SELECT, INSERT, UPDATE, DELETE)
   - Click "Make Changes"
   - You should see a success message

---

## ⚙️ Step 4: Configure Database Connection

1. **Open db_connect.php**
   - Navigate to `/admin/db_connect.php` in your file manager or via FTP
   - Open the file for editing

2. **Update Database Credentials**
   ```php
   $servername = "localhost";  // Usually "localhost" on Hostking
   $username = "your_full_username";  // e.g., "username_ama_nice_user"
   $password = "your_password";  // The password you created
   $dbname = "your_full_db_name";  // e.g., "username_ama_nice_db"
   ```

3. **Important Notes:**
   - Use the **full** database name and username (including Hostking prefix)
   - The servername is usually `localhost` on Hostking
   - Save the file after making changes

---

## 🗄️ Step 5: Create Database Table

1. **Open phpMyAdmin**
   - In cPanel, find "phpMyAdmin" in the Databases section
   - Click to open phpMyAdmin

2. **Select Your Database**
   - In the left sidebar, click on your database name
   - You should see an empty database

3. **Import SQL Schema**
   - Click on the "SQL" tab at the top
   - Open the file `/admin/schema.sql` in a text editor
   - Copy the entire SQL code from the file
   - Paste it into the SQL textarea in phpMyAdmin
   - Click "Go" to execute

4. **Verify Table Creation**
   - You should see a success message
   - In the left sidebar, you should now see a `products` table
   - Click on the `products` table to verify it was created correctly

**Alternative: Manual Table Creation**

If the SQL import doesn't work, you can create the table manually:

1. Click "SQL" tab in phpMyAdmin
2. Copy and paste this SQL:

```sql
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
  `shoe_sizes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_type` (`type`),
  INDEX `idx_is_shoe` (`is_shoe`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

3. Click "Go" to execute

---

## ✅ Step 6: Test the Setup

### Test 1: Database Connection

1. **Test Connection File**
   - Create a test file: `test_connection.php` in the `/admin/` folder
   - Add this code:
   ```php
   <?php
   require_once 'db_connect.php';
   if ($conn && !$conn->connect_error) {
       echo "✅ Database connection successful!";
   } else {
       echo "❌ Database connection failed!";
   }
   ?>
   ```
   - Access it via browser: `https://yourdomain.com/admin/test_connection.php`
   - You should see "✅ Database connection successful!"

### Test 2: API Endpoints

1. **Test Get Products**
   - Open browser and go to: `https://yourdomain.com/admin/getProducts.php`
   - You should see: `[]` (empty array, which is correct for a new database)

2. **Test Save Product** (using browser console or Postman)
   - Open browser console on your admin page
   - Run this test:
   ```javascript
   fetch('/admin/saveProduct.php', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({
           type: 'Test Product',
           category: 'men',
           price: 100,
           priceRange: 'R50 - R150',
           description: 'Test description',
           image: 'Assets/images/test.jpg',
           stockQuantity: 10
       })
   })
   .then(r => r.json())
   .then(data => console.log(data));
   ```
   - You should see: `{status: "success", id: 1, message: "Product saved successfully"}`

3. **Test Get Products Again**
   - Refresh: `https://yourdomain.com/admin/getProducts.php`
   - You should now see the test product in JSON format

### Test 3: Admin Dashboard

1. **Log into Admin Dashboard**
   - Go to your admin login page
   - Log in with your credentials
   - Try adding a new product
   - Check if it appears in the product list
   - Verify it persists after page refresh

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"

**Solutions:**
1. ✅ Verify database credentials in `db_connect.php`
2. ✅ Check if database name includes Hostking prefix
3. ✅ Check if username includes Hostking prefix
4. ✅ Verify password is correct (no extra spaces)
5. ✅ Confirm database user has privileges
6. ✅ Check if database exists in phpMyAdmin

### Issue: "Table doesn't exist"

**Solutions:**
1. ✅ Go to phpMyAdmin
2. ✅ Select your database
3. ✅ Check if `products` table exists
4. ✅ If not, run the SQL schema again
5. ✅ Verify table structure matches schema.sql

### Issue: "Access denied for user"

**Solutions:**
1. ✅ Verify user has been added to database
2. ✅ Check user privileges (should have ALL PRIVILEGES)
3. ✅ Verify username includes Hostking prefix
4. ✅ Try recreating the user and reassigning

### Issue: "Products not saving"

**Solutions:**
1. ✅ Check browser console for errors
2. ✅ Verify API endpoint is accessible: `/admin/saveProduct.php`
3. ✅ Check PHP error logs in cPanel
4. ✅ Verify database connection is working
5. ✅ Check if table structure is correct

### Issue: "CORS errors"

**Solutions:**
1. ✅ All API endpoints include CORS headers
2. ✅ If still having issues, check if your hosting blocks CORS
3. ✅ Verify you're accessing via the same domain

---

## 📊 Database Structure

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(255) | Product name (optional) |
| type | VARCHAR(100) | Product type (required) |
| category | VARCHAR(100) | Category: men/women/kids (required) |
| gender | VARCHAR(50) | Gender: male/female/unisex |
| price | DECIMAL(10,2) | Product price |
| price_range | VARCHAR(50) | Price range string |
| description | TEXT | Product description |
| image | VARCHAR(255) | Image path/URL (required) |
| stock_quantity | INT | Stock quantity |
| stock_number | VARCHAR(50) | Stock number |
| size | VARCHAR(50) | Product size |
| is_shoe | TINYINT(1) | Whether product is a shoe |
| shoe_brand | VARCHAR(100) | Shoe brand |
| shoe_sizes | TEXT | JSON array of shoe sizes |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

## 🔒 Security Notes

1. **Protect db_connect.php**
   - Never commit actual credentials to version control
   - Use strong passwords for database users
   - Restrict file permissions if possible

2. **SQL Injection Protection**
   - All API endpoints use prepared statements
   - User input is sanitized before database queries

3. **Error Handling**
   - Database errors are logged but not exposed to users
   - Generic error messages shown to frontend

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review PHP error logs in cPanel
3. Verify database credentials
4. Test API endpoints individually
5. Check browser console for JavaScript errors

---

## 🎉 Next Steps

Once the database is set up:

1. ✅ Test adding products via admin dashboard
2. ✅ Verify products appear on the store front
3. ✅ Test editing products
4. ✅ Test deleting products
5. ✅ Verify data persists after browser refresh

Your AMA-NICE CLOTHING site is now using MySQL database storage! 🚀

