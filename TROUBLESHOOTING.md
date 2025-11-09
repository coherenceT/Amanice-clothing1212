# Troubleshooting Guide - Hostking Database Setup

## 🔍 Common Issues and Solutions

### Issue 1: Database Connection Failed

**Error Message:**
```
Database connection failed. Please check your configuration.
```

**Solutions:**

1. **Check Database Credentials**
   - Verify database name includes Hostking prefix (e.g., `youruser_ama_nice_db`)
   - Verify username includes Hostking prefix (e.g., `youruser_admin`)
   - Verify password is correct (no extra spaces)
   - Check `db_connect.php` has correct credentials

2. **Verify Database Exists**
   - Go to cPanel → MySQL Databases
   - Check if database exists
   - Verify database name is correct

3. **Verify User Exists**
   - Go to cPanel → MySQL Databases
   - Check if user exists
   - Verify username is correct

4. **Verify User is Assigned to Database**
   - Go to cPanel → MySQL Databases
   - Check "Add User to Database" section
   - Verify user is assigned to database
   - Verify user has ALL PRIVILEGES

5. **Check Hostname**
   - Usually `localhost` on Hostking
   - If unsure, check with Hostking support

---

### Issue 2: Access Denied for User

**Error Message:**
```
Access denied for user 'youruser_admin'@'localhost' (using password: YES)
```

**Solutions:**

1. **Check Username**
   - Verify username includes Hostking prefix
   - Check for typos in username

2. **Check Password**
   - Verify password is correct
   - Check for extra spaces before/after password
   - Verify password doesn't have special characters that need escaping

3. **Verify User Has Privileges**
   - Go to cPanel → MySQL Databases
   - Check if user is assigned to database
   - Verify user has ALL PRIVILEGES (or at least SELECT, INSERT, UPDATE, DELETE)

4. **Recreate User (if needed)**
   - Delete user from database
   - Remove user
   - Create user again
   - Assign to database with ALL PRIVILEGES

---

### Issue 3: Unknown Database

**Error Message:**
```
Unknown database 'ama_nice_db'
```

**Solutions:**

1. **Check Database Name**
   - Verify database name includes Hostking prefix
   - Full name should be: `youruser_ama_nice_db`
   - Check `db_connect.php` has full database name

2. **Verify Database Exists**
   - Go to cPanel → MySQL Databases
   - Check if database exists
   - If not, create it

3. **Check Database Name in cPanel**
   - Look at "Current Databases" section
   - Find your database name (with prefix)
   - Use that exact name in `db_connect.php`

---

### Issue 4: Table Doesn't Exist

**Error Message:**
```
Table 'products' doesn't exist
```

**Solutions:**

1. **Run schema.sql**
   - Go to phpMyAdmin
   - Select your database
   - Click "SQL" tab
   - Copy and paste contents of `schema.sql`
   - Click "Go"

2. **Verify Table Was Created**
   - In phpMyAdmin, check if `products` table exists
   - Click on table to verify structure

3. **Check for Errors**
   - Look for error messages in phpMyAdmin
   - Verify SQL syntax is correct
   - Check if table already exists (might need to drop it first)

---

### Issue 5: Products Not Saving to Database

**Symptoms:**
- Products added via admin dashboard don't appear in database
- Products still stored in localStorage
- Browser console shows errors

**Solutions:**

1. **Check Browser Console**
   - Open browser console (F12)
   - Look for JavaScript errors
   - Look for fetch() errors
   - Check network tab for failed requests

2. **Test API Endpoints**
   - Test `getProducts.php` directly in browser
   - Test `saveProduct.php` via browser console
   - Check for PHP errors

3. **Check Database Connection**
   - Run `test_connection.php`
   - Verify connection works
   - Check if products table exists

4. **Check PHP Error Logs**
   - Go to cPanel → Error Log
   - Look for PHP errors
   - Check for database errors

5. **Verify productManager.js**
   - Check if `productManager.js` is using API endpoints
   - Verify `saveProduct()` method calls `/admin/saveProduct.php`
   - Check for async/await issues

---

### Issue 6: CORS Errors

**Error Message:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solutions:**

1. **Verify CORS Headers**
   - Check if PHP files have CORS headers
   - Verify headers are set before any output

2. **Check for Whitespace**
   - Verify no whitespace before `<?php` tag
   - Check for BOM (Byte Order Mark) in files
   - Remove any echo/print before headers

3. **Verify Headers are Set**
   - Check if `header()` calls are before any output
   - Verify no HTML output before headers
   - Check for PHP errors before headers

4. **Test OPTIONS Request**
   - Verify OPTIONS preflight requests are handled
   - Check if OPTIONS handler returns 200 status

---

### Issue 7: Images Not Uploading

**Symptoms:**
- Image upload fails
- Images not saved to server
- Image paths not stored in database

**Solutions:**

1. **Check File Permissions**
   - Verify `/Assets/uploads/` folder exists
   - Check folder permissions (should be 755)
   - Verify web server can write to folder

2. **Check PHP Upload Settings**
   - Verify `upload_max_filesize` in php.ini
   - Check `post_max_size` in php.ini
   - Verify `file_uploads` is enabled

3. **Test upload.php**
   - Test `admin/upload.php` directly
   - Check for PHP errors
   - Verify upload directory is writable

4. **Check Browser Console**
   - Look for upload errors
   - Check network tab for failed requests
   - Verify image file is being sent

---

### Issue 8: PHP Errors Not Showing

**Symptoms:**
- Errors not displayed
- Blank pages
- No error messages

**Solutions:**

1. **Enable Error Reporting (Testing Only)**
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Check Error Logs**
   - Go to cPanel → Error Log
   - View PHP errors
   - Check for database errors

3. **Check PHP Version**
   - Verify PHP version is compatible
   - Check if mysqli extension is enabled
   - Verify PHP settings are correct

---

### Issue 9: Products Not Appearing on Website

**Symptoms:**
- Products saved to database
- Products not showing on website
- Empty product list

**Solutions:**

1. **Check productDisplay.js**
   - Verify `getAllProducts()` is called
   - Check if API endpoint is being called
   - Verify async/await is used correctly

2. **Test getProducts.php**
   - Access directly in browser
   - Verify it returns JSON
   - Check if products are in response

3. **Check Browser Console**
   - Look for JavaScript errors
   - Check for fetch() errors
   - Verify products are loaded

4. **Check Database**
   - Verify products exist in database
   - Check if products have correct category
   - Verify image paths are correct

---

### Issue 10: Cannot Modify Header Information

**Error Message:**
```
Cannot modify header information - headers already sent
```

**Solutions:**

1. **Remove Whitespace**
   - Check for whitespace before `<?php` tag
   - Remove any spaces or newlines before `<?php`
   - Check for BOM (Byte Order Mark)

2. **Check for Output Before Headers**
   - Verify no echo/print before header() calls
   - Check for HTML output before headers
   - Remove any output before headers

3. **Verify File Encoding**
   - Save files as UTF-8 without BOM
   - Check file encoding in editor
   - Re-save files if needed

---

## 🔧 Debugging Steps

### Step 1: Check Database Connection

```php
// Create test file: test_db.php
<?php
require_once 'db_connect.php';
if ($conn) {
    echo "✅ Connected to database: " . $conn->query("SELECT DATABASE()")->fetch_row()[0];
} else {
    echo "❌ Connection failed";
}
?>
```

### Step 2: Check API Endpoints

```bash
# Test getProducts.php
curl https://yourdomain.com/admin/getProducts.php

# Test saveProduct.php
curl -X POST https://yourdomain.com/admin/saveProduct.php \
  -H "Content-Type: application/json" \
  -d '{"type":"Test","category":"men","image":"test.jpg"}'
```

### Step 3: Check Browser Console

```javascript
// Test in browser console
fetch('/admin/getProducts.php')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));
```

### Step 4: Check PHP Error Logs

1. Go to cPanel → Error Log
2. Look for recent errors
3. Check for database errors
4. Check for PHP syntax errors

---

## 📞 Getting Help

### Before Contacting Support

1. ✅ Check this troubleshooting guide
2. ✅ Check error logs in cPanel
3. ✅ Test API endpoints individually
4. ✅ Check browser console for errors
5. ✅ Verify database credentials are correct

### Information to Provide

1. **Error Message:** Exact error message
2. **Error Location:** Which file/endpoint
3. **Steps to Reproduce:** What you were doing
4. **Error Logs:** Relevant error log entries
5. **Browser Console:** Any JavaScript errors
6. **PHP Version:** Your PHP version
7. **Database Info:** Database name, username (without password!)

### Contact Support

- **Hostking Support:** For database/hosting issues
- **Check Documentation:** HOSTKING_SETUP_GUIDE.md
- **Check API Docs:** API_ENDPOINTS.md

---

## ✅ Quick Checklist

- [ ] Database credentials are correct (with prefixes)
- [ ] Database user has ALL PRIVILEGES
- [ ] Products table exists
- [ ] db_connect.php has correct credentials
- [ ] API endpoints return JSON (not errors)
- [ ] CORS headers are set
- [ ] No PHP errors in error logs
- [ ] No JavaScript errors in browser console
- [ ] File permissions are correct
- [ ] Upload directory is writable

---

## 🎯 Common Fixes

### Fix 1: Database Connection
```php
// Check credentials in db_connect.php
$username = "youruser_admin";  // With prefix!
$dbname = "youruser_ama_nice_db";  // With prefix!
```

### Fix 2: Table Doesn't Exist
```sql
-- Run in phpMyAdmin
CREATE TABLE IF NOT EXISTS `products` (...);
```

### Fix 3: CORS Errors
```php
// Add to top of PHP files (before any output)
header('Access-Control-Allow-Origin: *');
```

### Fix 4: File Permissions
```bash
# Set via File Manager or FTP
chmod 644 *.php
chmod 755 Assets/uploads/
```

---

**If you're still having issues, check the detailed setup guide: HOSTKING_SETUP_GUIDE.md**

