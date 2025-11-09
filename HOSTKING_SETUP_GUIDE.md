# Hostking MySQL Database Setup Guide - Step by Step

This guide will walk you through setting up the MySQL database for AMA-NICE CLOTHING on Hostking hosting.

## 📋 Prerequisites

- Hostking hosting account with cPanel access
- FTP/File Manager access to your website files
- Database credentials ready:
  - Database name: `ama_nice_db`
  - Username: `admin`
  - Password: `boss@123`

---

## Step 1: Create MySQL Database in Hostking cPanel

### 1.1 Log into cPanel

1. Go to your Hostking hosting account
2. Log in with your credentials
3. Find and click on **"cPanel"** or **"Control Panel"**

### 1.2 Navigate to MySQL Databases

1. In cPanel, scroll down to the **"Databases"** section
2. Click on **"MySQL Databases"** or **"MySQL Database Wizard"**
3. You'll see the MySQL Databases interface

### 1.3 Create Database

1. **Find "Create New Database" section**
   - Look for a text field labeled "New Database:"
   
2. **Enter database name**
   - Type: `ama_nice_db`
   - **Important:** Hostking automatically prefixes your database name with your cPanel username
   - If your cPanel username is `youruser`, the full database name will be: `youruser_ama_nice_db`
   - **Remember this full name** - you'll need it later!

3. **Click "Create Database"**
   - You should see a success message: "Database `youruser_ama_nice_db` has been created"

### 1.4 Create Database User

1. **Scroll down to "MySQL Users" section**
   - Find "Add New User" or "Create New User"

2. **Enter username**
   - Username: `admin`
   - **Important:** Hostking prefixes usernames too!
   - Full username will be: `youruser_admin`
   - **Remember this full username!**

3. **Enter password**
   - Password: `boss@123`
   - Confirm password: `boss@123`
   - **Tip:** Use a strong password generator if you want extra security

4. **Click "Create User"**
   - You should see: "User `youruser_admin` has been created"

### 1.5 Assign User to Database

1. **Scroll to "Add User to Database" section**
   - Find the dropdown menus

2. **Select user and database**
   - User dropdown: Select `youruser_admin`
   - Database dropdown: Select `youruser_ama_nice_db`
   - Click **"Add"**

3. **Set Privileges**
   - Check **"ALL PRIVILEGES"** (or at minimum: SELECT, INSERT, UPDATE, DELETE)
   - Click **"Make Changes"**
   - You should see: "User `youruser_admin` has been added to the database `youruser_ama_nice_db`"

### 1.6 Note Your Full Credentials

**Write down your full credentials (with Hostking prefixes):**

```
Full Database Name: youruser_ama_nice_db
Full Username: youruser_admin
Password: boss@123
Hostname: localhost (usually)
```

**⚠️ Important:** Replace `youruser` with your actual cPanel username!

---

## Step 2: Create Products Table Using phpMyAdmin

### 2.1 Open phpMyAdmin

1. In cPanel, scroll to **"Databases"** section
2. Click on **"phpMyAdmin"**
3. phpMyAdmin will open in a new tab/window

### 2.2 Select Your Database

1. In the left sidebar, find and click on your database name
   - It will be: `youruser_ama_nice_db`
2. The database should be empty (no tables yet)

### 2.3 Import SQL Schema

**Method 1: Using SQL Tab (Recommended)**

1. **Click on "SQL" tab** at the top of phpMyAdmin
2. **Open the schema.sql file** on your computer
   - Location: `/admin/schema.sql`
   - Open it with a text editor (Notepad, TextEdit, VS Code, etc.)
3. **Copy the entire SQL code** from the file
4. **Paste it into the SQL textarea** in phpMyAdmin
5. **Click "Go"** button at the bottom
6. You should see a success message: "Table 'products' has been created"

**Method 2: Using Import Tab**

1. Click on **"Import"** tab at the top
2. Click **"Choose File"** button
3. Select your `schema.sql` file from your computer
4. Click **"Go"** at the bottom
5. Wait for the import to complete

### 2.4 Verify Table Creation

1. In the left sidebar, you should now see a **"products"** table
2. Click on the **"products"** table
3. Click on **"Structure"** tab
4. You should see all the columns:
   - id, name, type, category, gender, price, price_range, description, image, stock_quantity, etc.

**✅ Success!** Your database table is now created.

---

## Step 3: Update db_connect.php with Hostking Credentials

### 3.1 Find Your Full Database Credentials

From Step 1, you should have:
- Full database name: `youruser_ama_nice_db`
- Full username: `youruser_admin`
- Password: `boss@123`
- Hostname: `localhost` (usually on Hostking)

### 3.2 Edit db_connect.php

**Option 1: Using cPanel File Manager**

1. In cPanel, click on **"File Manager"**
2. Navigate to your website's root directory (usually `public_html` or `www`)
3. Go to `/admin/` folder
4. Right-click on `db_connect.php`
5. Select **"Edit"** or **"Code Edit"**
6. The file will open in the editor

**Option 2: Using FTP**

1. Connect to your Hostking server via FTP
2. Navigate to `/admin/` folder
3. Download `db_connect.php`
4. Edit it locally with a text editor
5. Upload it back to the server

### 3.3 Update the Credentials

Find these lines in `db_connect.php`:

```php
$servername = "localhost";
$username = "my_db_user";        // Change this
$password = "my_db_password";    // Change this
$dbname = "ama_nice_db";         // Change this
```

**Update them to:**

```php
$servername = "localhost";
$username = "youruser_admin";           // Your full username with prefix
$password = "boss@123";                 // Your password
$dbname = "youruser_ama_nice_db";       // Your full database name with prefix
```

**⚠️ Important:** 
- Replace `youruser` with your actual cPanel username
- Keep the quotes around the values
- Don't add any extra spaces

### 3.4 Save the File

1. **If using File Manager:** Click "Save Changes"
2. **If using FTP:** Upload the updated file

---

## Step 4: Test Database Connection

### 4.1 Create Test Connection File

Create a new file called `test_connection.php` in the `/admin/` folder.

**Using File Manager:**
1. Go to `/admin/` folder in File Manager
2. Click "New File"
3. Name it: `test_connection.php`
4. Click "Edit" to open it

**Add this code:**

```php
<?php
/**
 * Test Database Connection
 * This file tests if the database connection is working.
 * DELETE THIS FILE after testing for security!
 */

// Include database connection
require_once 'db_connect.php';

// Check if connection is successful
if (isset($conn) && $conn && !$conn->connect_error) {
    echo "<h2 style='color: green;'>✅ Database Connection Successful!</h2>";
    echo "<p><strong>Database:</strong> " . $conn->query("SELECT DATABASE()")->fetch_row()[0] . "</p>";
    echo "<p><strong>Server Info:</strong> " . $conn->server_info . "</p>";
    
    // Test if products table exists
    $result = $conn->query("SHOW TABLES LIKE 'products'");
    if ($result->num_rows > 0) {
        echo "<p style='color: green;'>✅ Products table exists!</p>";
        
        // Count products
        $count = $conn->query("SELECT COUNT(*) as count FROM products")->fetch_assoc()['count'];
        echo "<p><strong>Products in database:</strong> $count</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Products table not found. Run schema.sql in phpMyAdmin.</p>";
    }
    
    $conn->close();
} else {
    echo "<h2 style='color: red;'>❌ Database Connection Failed!</h2>";
    if (isset($conn)) {
        echo "<p><strong>Error:</strong> " . $conn->connect_error . "</p>";
    }
    echo "<p>Please check your credentials in db_connect.php</p>";
}
?>
```

### 4.2 Test the Connection

1. **Open your browser**
2. **Navigate to:** `https://yourdomain.com/admin/test_connection.php`
   - Replace `yourdomain.com` with your actual domain
3. **You should see:**
   - ✅ Green success message if connection works
   - ❌ Red error message if connection fails

### 4.3 Troubleshooting Connection Issues

**If you see an error:**

1. **"Access denied for user"**
   - Check if username includes Hostking prefix
   - Verify password is correct
   - Check if user has been added to database

2. **"Unknown database"**
   - Check if database name includes Hostking prefix
   - Verify database was created successfully

3. **"Can't connect to MySQL server"**
   - Verify hostname is `localhost`
   - Check if MySQL service is running (contact Hostking support)

### 4.4 Delete Test File (Important!)

**After testing, DELETE `test_connection.php` for security!**

1. Go to File Manager
2. Navigate to `/admin/` folder
3. Delete `test_connection.php`

---

## Step 5: Test API Endpoints

### 5.1 Test Get Products Endpoint

1. **Open browser**
2. **Navigate to:** `https://yourdomain.com/admin/getProducts.php`
3. **You should see:** `[]` (empty array) - this is correct for a new database

**If you see an error:**
- Check browser console (F12) for errors
- Verify db_connect.php credentials are correct
- Check if products table exists in phpMyAdmin

### 5.2 Test Save Product Endpoint

1. **Open browser console** (F12)
2. **Go to Console tab**
3. **Paste this test code:**

```javascript
fetch('/admin/saveProduct.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        type: 'Test Product',
        category: 'men',
        price: 100,
        priceRange: 'R50 - R150',
        description: 'This is a test product',
        image: 'Assets/images/test.jpg',
        stockQuantity: 10
    })
})
.then(response => response.json())
.then(data => {
    console.log('Response:', data);
    if (data.status === 'success') {
        console.log('✅ Product saved successfully! ID:', data.id);
    } else {
        console.error('❌ Error:', data.message);
    }
})
.catch(error => {
    console.error('❌ Request failed:', error);
});
```

4. **Press Enter**
5. **You should see:** `{status: "success", id: 1, message: "Product saved successfully"}`

### 5.3 Verify Product Was Saved

1. **Go back to:** `https://yourdomain.com/admin/getProducts.php`
2. **You should now see:** The test product in JSON format
3. **Or check phpMyAdmin:**
   - Go to phpMyAdmin
   - Select your database
   - Click on `products` table
   - Click "Browse" tab
   - You should see your test product

### 5.4 Test Update Product

```javascript
fetch('/admin/updateProduct.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        id: 1,
        price: 120,
        stockQuantity: 15
    })
})
.then(r => r.json())
.then(data => console.log(data));
```

### 5.5 Test Delete Product

```javascript
fetch('/admin/deleteProduct.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: 1})
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## Step 6: Verify Admin Dashboard Works

### 6.1 Access Admin Dashboard

1. **Go to your website**
2. **Navigate to admin login page**
3. **Log in with your credentials**
4. **You should see the admin dashboard**

### 6.2 Test Adding a Product

1. **Click on "Add New Product" tab**
2. **Fill in the form:**
   - Upload an image
   - Enter product type
   - Select category (Men's/Women's/Kids)
   - Enter price and description
   - Set stock quantity
3. **Click "Add Product"**
4. **You should see:** Success message
5. **Check if product appears in the product list**

### 6.3 Verify Product is in Database

1. **Go to phpMyAdmin**
2. **Select your database**
3. **Click on `products` table**
4. **Click "Browse" tab**
5. **You should see your product in the database**

### 6.4 Test Editing a Product

1. **In admin dashboard, find a product**
2. **Click "Edit" button**
3. **Change some details (price, description, etc.)**
4. **Click "Save Changes"**
5. **Verify changes are saved in database**

### 6.5 Test Deleting a Product

1. **In admin dashboard, find a product**
2. **Click "Delete" button**
3. **Confirm deletion**
4. **Verify product is removed from database**

### 6.6 Check Browser Console

1. **Open browser console** (F12)
2. **Go to Console tab**
3. **Look for any errors**
4. **You should see:** Success messages like "Product saved to database"

---

## Step 7: Troubleshooting PHP Errors

### 7.1 Enable Error Reporting (For Testing)

**Create a test file `test_errors.php` in `/admin/` folder:**

```php
<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection
require_once 'db_connect.php';

// Test query
$result = $conn->query("SELECT * FROM products LIMIT 1");
if ($result) {
    echo "✅ Query successful!";
} else {
    echo "❌ Query failed: " . $conn->error;
}
?>
```

**Access it:** `https://yourdomain.com/admin/test_errors.php`

**⚠️ Remember to disable error display in production!**

### 7.2 Check Error Logs in cPanel

1. **In cPanel, find "Errors" or "Error Log"**
2. **Click on it**
3. **You'll see PHP errors logged here**
4. **Look for database-related errors**

### 7.3 Common PHP Errors

**Error: "Call to undefined function mysqli_connect()"**
- **Solution:** PHP mysqli extension is not enabled (contact Hostking support)

**Error: "Access denied for user"**
- **Solution:** Check database credentials in db_connect.php
- Verify user has been added to database
- Check user privileges

**Error: "Table 'products' doesn't exist"**
- **Solution:** Run schema.sql in phpMyAdmin to create the table

**Error: "Cannot modify header information"**
- **Solution:** Remove any whitespace before `<?php` tag in PHP files
- Check for BOM (Byte Order Mark) in files

### 7.4 Check File Permissions

1. **In File Manager, right-click on files**
2. **Select "Change Permissions"**
3. **Recommended permissions:**
   - PHP files: `644` (readable by web server)
   - Directories: `755`
   - db_connect.php: `600` (more secure, only owner can read)

---

## Step 8: CORS and Fetch() Configuration

### 8.1 CORS Headers (Already Configured)

All PHP API endpoints already include CORS headers:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

**This allows fetch() requests from your JavaScript to work correctly.**

### 8.2 Test CORS is Working

1. **Open browser console** (F12)
2. **Go to Network tab**
3. **Try adding a product in admin dashboard**
4. **Look for requests to `/admin/saveProduct.php`**
5. **Check Response Headers:**
   - Should include `Access-Control-Allow-Origin: *`
   - Should not show CORS errors

### 8.3 If CORS Errors Occur

**If you see CORS errors in browser console:**

1. **Check if PHP files have CORS headers** (they should)
2. **Verify no whitespace before `<?php` tag**
3. **Check if .htaccess is blocking headers** (unlikely on Hostking)
4. **Contact Hostking support if issues persist**

---

## Step 9: Image Storage - ImgBB vs MySQL

### 9.1 How Image Storage Works

**Current Setup:**
1. **Images are uploaded** via `admin/upload.php`
2. **Images are saved to** `/Assets/uploads/` folder on your server
3. **Image path is stored in database** (e.g., `Assets/uploads/image.jpg`)
4. **Database stores the path, not the image itself**

### 9.2 Is ImgBB Still Needed?

**Short Answer: No, ImgBB is optional.**

**MySQL stores image paths, not images:**
- ✅ Images are stored on your Hostking server in `/Assets/uploads/`
- ✅ Database stores the path to the image
- ✅ No need for ImgBB if you're happy with server storage

**ImgBB is useful if:**
- You want cloud storage (images not on your server)
- You want to reduce server storage usage
- You want faster CDN delivery
- You want backup storage

**For now, you can:**
- ✅ Use server storage only (no ImgBB needed)
- ✅ All images stored in `/Assets/uploads/`
- ✅ Database stores paths to images
- ✅ Everything stays on your Hostking hosting

### 9.3 Image Upload Flow

1. **User uploads image** in admin dashboard
2. **JavaScript sends image to** `admin/upload.php`
3. **PHP saves image to** `/Assets/uploads/` folder
4. **PHP returns image path** (e.g., `Assets/uploads/image_123456.jpg`)
5. **JavaScript saves product with image path** to database via `saveProduct.php`
6. **Database stores the path** in `image` column
7. **Website displays image** using the stored path

### 9.4 Verify Image Upload Works

1. **Upload an image in admin dashboard**
2. **Check if image appears in** `/Assets/uploads/` folder (via File Manager)
3. **Check database** - `image` column should have the path
4. **View product on website** - image should display

---

## ✅ Final Checklist

- [ ] MySQL database created in cPanel
- [ ] Database user created and assigned to database
- [ ] Products table created via schema.sql
- [ ] db_connect.php updated with correct credentials
- [ ] Test connection works (test_connection.php)
- [ ] API endpoints work (getProducts.php, saveProduct.php, etc.)
- [ ] Admin dashboard can add products
- [ ] Admin dashboard can edit products
- [ ] Admin dashboard can delete products
- [ ] Products appear in database (phpMyAdmin)
- [ ] Images upload to /Assets/uploads/ folder
- [ ] Image paths stored in database
- [ ] No PHP errors in error logs
- [ ] CORS headers working (no CORS errors in console)
- [ ] Test files deleted (test_connection.php, test_errors.php)

---

## 🎉 Success!

If all steps are completed successfully, your AMA-NICE CLOTHING website is now using MySQL database storage!

**Your products are now:**
- ✅ Stored permanently in MySQL database
- ✅ Shared across all users/devices
- ✅ Not dependent on browser localStorage
- ✅ Accessible via phpMyAdmin
- ✅ Backed up with your hosting backup

**Next Steps:**
1. Add your products via admin dashboard
2. Verify they appear on your website
3. Set up regular database backups
4. Monitor error logs for any issues

---

## 📞 Need Help?

If you encounter issues:

1. **Check error logs** in cPanel
2. **Verify database credentials** are correct
3. **Test API endpoints** individually
4. **Check browser console** for JavaScript errors
5. **Contact Hostking support** if database connection issues persist

---

**Congratulations! Your database is now set up and ready to use! 🚀**

