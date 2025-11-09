# Quick Reference - Hostking Database Setup

## 🔑 Your Database Credentials

**⚠️ Important: Hostking adds prefixes to database names and usernames!**

Replace `youruser` with your actual cPanel username.

### Database Credentials Template

```
Database Name: youruser_ama_nice_db
Username: youruser_admin
Password: boss@123
Hostname: localhost
```

### Example (if your cPanel username is "john")

```
Database Name: john_ama_nice_db
Username: john_admin
Password: boss@123
Hostname: localhost
```

---

## 📝 db_connect.php Configuration

Update these lines in `/admin/db_connect.php`:

```php
$servername = "localhost";
$username = "youruser_admin";           // Your full username with prefix
$password = "boss@123";                 // Your password
$dbname = "youruser_ama_nice_db";       // Your full database name with prefix
```

---

## 🗄️ Database Table Structure

**Table Name:** `products`

**Key Columns:**
- `id` - Primary key (auto-increment)
- `type` - Product type (required)
- `category` - men/women/kids (required)
- `price` - Product price
- `price_range` - Price range string
- `description` - Product description
- `image` - Image path/URL (required)
- `stock_quantity` - Stock quantity
- `is_shoe` - Whether product is a shoe (0 or 1)
- `shoe_brand` - Shoe brand
- `shoe_sizes` - JSON array of shoe sizes
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

---

## 🔗 API Endpoints

All endpoints are in `/admin/` folder:

- **GET Products:** `https://yourdomain.com/admin/getProducts.php`
- **Save Product:** `https://yourdomain.com/admin/saveProduct.php` (POST)
- **Update Product:** `https://yourdomain.com/admin/updateProduct.php` (POST)
- **Delete Product:** `https://yourdomain.com/admin/deleteProduct.php` (POST)

---

## ✅ Setup Checklist

- [ ] Database created in cPanel
- [ ] Database user created
- [ ] User assigned to database with ALL PRIVILEGES
- [ ] Products table created (via schema.sql)
- [ ] db_connect.php updated with credentials
- [ ] Test connection works (test_connection.php)
- [ ] API endpoints tested
- [ ] Admin dashboard tested
- [ ] Test files deleted

---

## 🧪 Quick Test Commands

### Test Database Connection

```bash
# Access in browser:
https://yourdomain.com/admin/test_connection.php
```

### Test Get Products

```bash
# Access in browser:
https://yourdomain.com/admin/getProducts.php
```

### Test Save Product (Browser Console)

```javascript
fetch('/admin/saveProduct.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        type: 'Test Product',
        category: 'men',
        image: 'Assets/images/test.jpg',
        price: 100,
        description: 'Test description'
    })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🐛 Common Issues

### "Access denied for user"
- ✅ Check if username includes Hostking prefix
- ✅ Verify password is correct
- ✅ Check if user has been added to database

### "Unknown database"
- ✅ Check if database name includes Hostking prefix
- ✅ Verify database was created in cPanel

### "Table doesn't exist"
- ✅ Run schema.sql in phpMyAdmin
- ✅ Verify table was created successfully

### CORS Errors
- ✅ All API endpoints include CORS headers
- ✅ Check browser console for specific errors
- ✅ Verify no whitespace before `<?php` tag

---

## 📸 Image Storage

**How it works:**
1. Images uploaded via `admin/upload.php`
2. Saved to `/Assets/uploads/` folder
3. Image path stored in database
4. Database stores path, not image itself

**ImgBB:**
- ❌ **Not required** - Optional cloud storage
- ✅ **Server storage works fine** - Images stored on Hostking server
- ✅ **Database stores paths** - No need for ImgBB

---

## 🔒 Security Notes

1. **Delete test files after testing:**
   - `test_connection.php`
   - Any other test files

2. **File permissions:**
   - PHP files: `644`
   - db_connect.php: `600` (more secure)

3. **Never commit credentials to Git:**
   - db_connect.php should be in .gitignore
   - Use environment variables in production

---

## 📞 Support

If you encounter issues:

1. Check HOSTKING_SETUP_GUIDE.md for detailed steps
2. Check error logs in cPanel
3. Test API endpoints individually
4. Contact Hostking support for database issues

---

## 🎯 Quick Setup Steps

1. **Create database in cPanel** → MySQL Databases
2. **Create user in cPanel** → MySQL Users
3. **Assign user to database** → Add User to Database
4. **Run schema.sql in phpMyAdmin** → SQL tab
5. **Update db_connect.php** → Add credentials with prefixes
6. **Test connection** → test_connection.php
7. **Test API endpoints** → getProducts.php, saveProduct.php
8. **Test admin dashboard** → Add/edit/delete products
9. **Delete test files** → For security

---

**That's it! Your database is ready to use! 🚀**

