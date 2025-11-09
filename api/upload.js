// Vercel serverless function for file uploads
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({
      status: 'error',
      message: 'Method not allowed. Only POST requests are accepted.',
    });
    return;
  }

  try {
    // Parse multipart form data from request
    const formData = req.body;
    
    // For Vercel, we need to handle the file upload differently
    // Vercel has file size limitations, so we'll use a different approach
    // This function expects the file to be sent as base64 in the body
    
    if (!formData || !formData.image) {
      res.status(400).json({
        status: 'error',
        message: 'No file uploaded or upload error occurred.',
      });
      return;
    }

    const { image, fileName, fileType } = formData;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = fileName.toLowerCase().split('.').pop();

    if (!allowedExtensions.includes(fileExtension)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.',
      });
      return;
    }

    // Validate file size (max 10MB)
    const fileSize = Buffer.byteLength(image, 'base64');
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (fileSize > maxFileSize) {
      res.status(400).json({
        status: 'error',
        message: 'File is too large. Maximum file size is 10MB.',
      });
      return;
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const sanitizedOriginalName = fileName.replace(/[^a-z0-9_-]/gi, '_').substring(0, 50);
    const newFileName = `${sanitizedOriginalName}_${timestamp}_${randomString}.${fileExtension}`;

    // Set upload directory
    const uploadDir = path.join(process.cwd(), 'Assets', 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
    }

    // Convert base64 to buffer and save file
    const fileBuffer = Buffer.from(image, 'base64');
    const filePath = path.join(uploadDir, newFileName);
    
    fs.writeFileSync(filePath, fileBuffer);

    // Return success response
    res.status(200).json({
      status: 'success',
      path: `Assets/uploads/${newFileName}`,
      fileName: newFileName,
      fileSize: fileSize,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: `Upload failed: ${error.message}`,
    });
  }
}

