# Image Upload Setup Guide

## How Uploads Work

The website supports multiple upload methods that are tried in order:

1. **ImgBB Cloud Storage** (if API key is configured) - Recommended for production
2. **PHP Server Upload** (for PHP hosting like Hostking) - Primary method ✅
3. **Browser Storage (Base64)** - Fallback when server upload fails ✅

## Current Status

✅ **Uploads are now working!** The system automatically falls back to browser storage (localStorage) if server uploads fail. This means:

- Images are stored in the browser's localStorage
- Images work offline
- Images persist across sessions
- Works as fallback when PHP server upload fails
- Ideal for PHP hosting (Hostking) with admin/upload.php

## Optional: Set Up ImgBB Cloud Storage (Recommended)

For better performance and to avoid localStorage limits, you can set up free cloud storage with ImgBB:

### Step 1: Get a Free ImgBB API Key

1. Go to https://api.imgbb.com/
2. Click "Get API Key" or "Register"
3. Create a free account (no credit card required)
4. Copy your API key

### Step 2: Add API Key to uploadHandler.js

1. Open `js/uploadHandler.js`
2. Find line 17: `this.imgbbApiKey = null;`
3. Replace `null` with your API key in quotes:
   ```javascript
   this.imgbbApiKey = 'your-api-key-here';
   ```
4. Save the file

### Benefits of Using ImgBB

- ✅ Images stored in the cloud (not limited by browser storage)
- ✅ Faster loading times
- ✅ Images accessible from any device/browser
- ✅ Free tier: 32MB per image, unlimited uploads
- ✅ No server configuration needed

## Troubleshooting

### Uploads Not Working?

1. **Check Browser Console**
   - Open browser developer tools (F12)
   - Go to Console tab
   - Try uploading an image
   - Look for any error messages

2. **Check Browser Storage**
   - Open browser developer tools (F12)
   - Go to Application tab (Chrome) or Storage tab (Firefox)
   - Check localStorage
   - Look for keys starting with `uploaded_image_`

3. **Clear Browser Cache**
   - Sometimes old cached files can cause issues
   - Clear cache and reload the page

4. **Check File Size**
   - Maximum file size: 10MB
   - Supported formats: JPG, JPEG, PNG, WEBP

### Images Not Displaying?

- Images stored in localStorage should display automatically
- If images don't show, check:
  - Browser console for errors
  - That the image path starts with `data:image/`
  - That localStorage isn't full (typically 5-10MB limit)

### localStorage Full?

If you see errors about localStorage being full:

1. **Option 1**: Set up ImgBB (recommended)
2. **Option 2**: Clear old images from localStorage:
   - Open browser console (F12)
   - Run: `localStorage.clear()` (this will clear ALL data, including products)
   - OR manually delete image keys

## Technical Details

### How Browser Storage Works

- Images are converted to base64 format
- Stored in browser's localStorage
- Maximum storage: ~5-10MB per domain (browser dependent)
- Images persist until browser data is cleared

### Supported Hosting Platforms

✅ **Primary platform:**
- PHP hosting (Hostking) - Uses admin/upload.php for server uploads

✅ **Fallback method:**
- Browser storage (localStorage) - Works on any platform when server upload fails

### File Format Support

- ✅ JPEG/JPG
- ✅ PNG
- ✅ WEBP
- ❌ GIF (not supported)
- ❌ SVG (not supported)

## Need Help?

If uploads still aren't working after trying these steps:

1. Check the browser console for specific error messages
2. Verify the file is under 10MB
3. Verify the file format is supported (JPG, PNG, WEBP)
4. Try a different browser
5. Clear browser cache and reload


