# AMA-NICE CLOTHING E-Commerce Website

A client-side e-commerce website for a thrift store featuring product management, shopping cart, and admin dashboard with image upload capabilities.

## Project Structure

```
AMA-NICE-CLOTHING/
├── index.html              # Homepage
├── products.html           # All products listing
├── product.html            # Individual product detail page
├── product-type.html       # Product type listing page
├── sneakers.html           # Sneakers collection page
├── kids-packs.html         # Kids clothing packs page
├── login.html              # Admin login page
├── admin.html              # Admin dashboard
├── Assets/
│   ├── images/             # Pre-existing product images
│   └── uploads/            # Uploaded product images (created automatically)
├── data/
│   └── products.json       # Default product data
├── js/
│   ├── productManager.js   # Product data management
│   ├── productDisplay.js   # Product display logic
│   ├── cart.js             # Shopping cart functionality
│   └── common.js           # Common utilities
├── css/
│   └── style.css           # Main stylesheet
├── admin/
│   ├── upload.php          # PHP backend for image uploads
│   └── admin-utils.js      # Admin helper utilities (future)
└── README.md               # This file
```

## Features

- **Product Management**: Add, edit, delete products through admin dashboard
- **Image Uploads**: Upload product images to server (saved in `Assets/uploads/`)
- **Shopping Cart**: Add products to cart and send orders via WhatsApp
- **Responsive Design**: Mobile-friendly interface
- **Stock Management**: Track inventory for regular products and shoes
- **Category Filtering**: Browse by Men's, Women's, and Kids categories

## Running Locally (XAMPP/MAMP)

### Prerequisites
- XAMPP (Windows/Mac/Linux) or MAMP (Mac)
- PHP 7.4 or higher
- Modern web browser

### Setup Instructions

1. **Install XAMPP/MAMP**
   - Download from [XAMPP](https://www.apachefriends.org/) or [MAMP](https://www.mamp.info/)
   - Install following the installer instructions

2. **Copy Project Files**
   - Copy the entire `AMA-NICE-CLOTHING` folder to:
     - **XAMPP**: `C:\xampp\htdocs\` (Windows) or `/Applications/XAMPP/htdocs/` (Mac/Linux)
     - **MAMP**: `/Applications/MAMP/htdocs/`

3. **Start Server**
   - **XAMPP**: Open XAMPP Control Panel and start Apache
   - **MAMP**: Click "Start Servers" in MAMP application

4. **Set Permissions (Mac/Linux)**
   ```bash
   chmod 755 Assets/uploads
   ```
   Or use FileZilla/FTP client to set folder permissions to 755

5. **Access Website**
   - Open browser and navigate to:
     - `http://localhost/AMA-NICE-CLOTHING/index.html`
     - Or `http://localhost/AMA-NICE-CLOTHING/` (if index.html is set as default)

6. **Admin Access**
   - Navigate to `http://localhost/AMA-NICE-CLOTHING/admin.html`
   - Or tap the logo 5 times on the homepage
   - Default password: (set in login.html)

## Deploying Online (Hostking or similar hosting)

### Prerequisites
- Web hosting with PHP support (PHP 7.4+)
- FTP/SFTP access or File Manager
- Domain name (optional)

### Deployment Steps

1. **Upload Files via FTP/File Manager**
   - Upload all project files to your `public_html` or `www` directory
   - Maintain the folder structure exactly as shown above

2. **Set Folder Permissions**
   - Set `Assets/uploads/` folder permissions to **755** or **777**
   - This allows PHP to create and save uploaded images
   - Most hosting control panels allow you to set permissions via File Manager

3. **Create Uploads Directory**
   - The `Assets/uploads/` directory will be created automatically by `upload.php` on first upload
   - Alternatively, create it manually via File Manager:
     - Create folder: `Assets/uploads/`
     - Set permissions to 755

4. **Verify PHP is Enabled**
   - Most modern hosting providers have PHP enabled by default
   - Check with your hosting provider if you encounter issues

5. **Test Upload Functionality**
   - Log into admin dashboard
   - Try uploading a test image
   - Verify it appears in `Assets/uploads/` folder

6. **Access Your Website**
   - Visit your domain: `https://yourdomain.com/index.html`
   - Admin dashboard: `https://yourdomain.com/admin.html`

## Image Upload System

### How It Works

1. **Admin selects image** in the product form
2. **Image is uploaded** to `admin/upload.php` via POST request
3. **Server validates** the file (type, size, format)
4. **File is saved** to `Assets/uploads/` with a unique filename
5. **Server returns** JSON response with file path: `{"status":"success","path":"Assets/uploads/filename.jpg"}`
6. **Product is saved** with the returned file path in localStorage

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WEBP (.webp)

### File Size Limit
- Maximum file size: 10MB

### Upload Directory
- **Location**: `Assets/uploads/`
- **Created automatically** by `upload.php` if it doesn't exist
- **Must be writable** (permissions 755 or 777)

## File Paths

All paths in this project are **relative paths**, ensuring compatibility with both local development and online deployment:

- **CSS**: `css/style.css`
- **JavaScript**: `js/filename.js`
- **Images**: `Assets/images/filename.jpg` (pre-existing)
- **Uploaded Images**: `Assets/uploads/filename.jpg` (admin uploads)
- **Data**: `data/products.json`
- **PHP Scripts**: `admin/upload.php`

## Configuration

### Admin Password
- Edit `login.html` to change the admin password
- Current password is stored in localStorage after login

### WhatsApp Integration
- Update WhatsApp number in `js/cart.js` (line with `wa.me/` link)
- Current number: 073 163 5803

## Troubleshooting

### Images Not Uploading

1. **Check PHP is enabled** on your server
2. **Verify folder permissions** - `Assets/uploads/` must be writable (755 or 777)
3. **Check file size** - Ensure uploaded images are under 10MB
4. **Check browser console** for error messages
5. **Verify upload.php path** - Ensure it's accessible at `admin/upload.php`

### Images Not Displaying

1. **Check file paths** - Ensure all image paths use `Assets/images/` for pre-existing images
2. **Verify uploaded images** are in `Assets/uploads/` folder
3. **Check browser console** for 404 errors
4. **Clear browser cache** if images were recently moved

### Admin Dashboard Not Working

1. **Check JavaScript files** are loading (check browser console)
2. **Verify localStorage** is enabled in browser
3. **Check file paths** - All `js/` references should be correct
4. **Clear browser cache** and reload

## Security Notes

- **Admin password** is stored client-side (localStorage) - not secure for production
- **Image uploads** validate file types and sizes
- **No server-side authentication** - consider adding PHP session-based auth for production
- **Upload directory** should have proper permissions to prevent unauthorized access

## Support

For issues or questions:
- Check browser console for JavaScript errors
- Verify all file paths are correct
- Ensure PHP is properly configured on your server
- Contact hosting provider for server-side issues

## License

This project is proprietary software for AMA-NICE CLOTHING.

---

**Last Updated**: 2024
**Version**: 1.0

