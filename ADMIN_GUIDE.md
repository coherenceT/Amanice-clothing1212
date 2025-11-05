# AMA-NICE CLOTHING - Admin Portal Guide

## 🔐 How to Access the Admin Portal

### Step 1: Access the Login Page (Secret Method)

1. **Go to the main store page** (`index.html`)
2. **Tap the logo 5 times quickly** (within 2 seconds)
   - The logo is in the top-left corner of the page
   - You need to tap it 5 times in quick succession
   - If you wait more than 2 seconds between taps, the counter resets
3. **You'll be redirected** to the login page automatically

**Visual Feedback:**
- The logo will briefly scale up when you successfully trigger the login
- This confirms the 5-tap sequence worked

---

## 🔑 Login Credentials

### Default Login Information:

- **Username:** `admin`
- **Password:** `boss123`

### How to Change the Password:

1. Open `login.html` in a code editor
2. Find lines 184-185:
   ```javascript
   const ADMIN_USERNAME = 'admin';
   const ADMIN_PASSWORD = 'boss123';
   ```
3. Change `'boss123'` to your desired password
4. Save the file

**Note:** The password is stored in the browser's localStorage. After changing it in the code, the new password will be saved on first login.

---

## 📋 Step-by-Step Login Process

### 1. Access Login Page
- Tap logo 5 times on the main store page
- OR directly navigate to `login.html`

### 2. Enter Credentials
- **Username:** Type `admin`
- **Password:** Type `boss123`
- Click the eye icon to show/hide password

### 3. Login
- Click the "Login" button
- If credentials are correct, you'll be redirected to the Admin Dashboard
- If incorrect, you'll see an error message

### 4. Admin Dashboard
- You'll see the product management interface
- You can now add, edit, and delete products

---

## 🛡️ Security Features

### Session Management
- Login status is stored in `sessionStorage`
- You stay logged in until you:
  - Click "Logout" button
  - Close the browser tab/window
  - Clear browser data

### Auto-Redirect
- If you're already logged in and try to access `login.html`, you'll be automatically redirected to the admin dashboard
- If you're not logged in and try to access `admin.html`, you'll be redirected to the login page

---

## 📱 How the 5-Tap System Works

### Technical Details:

1. **Counter System:**
   - Each tap increments a counter
   - Counter resets after 2 seconds of inactivity
   - Requires exactly 5 taps within 2 seconds

2. **Visual Feedback:**
   - Logo scales up briefly when triggered
   - Provides confirmation that it worked

3. **Location:**
   - Works on the main store page (`index.html`)
   - Logo must be clicked (not just the text)

### Why This Method?
- Keeps the admin portal hidden from regular customers
- No visible "Admin Login" link on the store
- Only the boss knows the secret method

---

## 🎯 Admin Dashboard Features

Once logged in, you can:

### 1. **Add Products** (3 Tabs)
   - **Regular Products:** Standard clothing items
   - **Add Sneakers:** Dedicated sneaker upload with brand and sizes
   - **Add Kids Packs:** Kids clothing packs

### 2. **Manage Products**
   - View all products (default + admin-added)
   - Edit any product
   - Delete any product
   - Manage stock quantities

### 3. **Filter Products**
   - Filter by category (Men's/Women's/Kids)
   - Search by name, brand, or description
   - Filter by stock status
   - Show only default or admin products

### 4. **Stock Management**
   - Add/remove stock with +/- buttons
   - For shoes: manage stock per size
   - Default stock value: 1 for new items

---

## 🔄 Quick Reference

### Access Login:
```
Main Store → Tap Logo 5x → Login Page
```

### Login:
```
Username: admin
Password: boss123
```

### After Login:
```
Admin Dashboard → Manage Products → Add/Edit/Delete
```

### Logout:
```
Click "Logout" button in admin header
```

---

## ⚠️ Important Notes

1. **Password Security:**
   - Change the default password for security
   - The password is stored in browser localStorage (not encrypted)
   - For production use, consider a backend server

2. **Session Security:**
   - Always log out when done
   - Don't share your login credentials
   - The 5-tap method keeps the portal hidden

3. **Data Storage:**
   - All products are stored in browser localStorage
   - Images are stored as base64 (works offline)
   - Data persists until browser data is cleared

---

## 🆘 Troubleshooting

### Can't access login page?
- Make sure you tap the logo 5 times quickly (within 2 seconds)
- Try refreshing the page and trying again
- Or directly navigate to `login.html`

### Forgot password?
- Check `login.html` file, lines 184-185
- Or clear browser localStorage and it will reset to default

### Can't see products after adding?
- Refresh the page
- Check if filters are applied
- Make sure you're viewing the correct category

---

## 📞 Support

If you need to change login credentials or have issues, edit the `login.html` file directly.

