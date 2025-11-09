const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Method not allowed. Only POST requests are accepted.',
      }),
    };
  }

  try {
    // Parse multipart form data
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Invalid content type. Expected multipart/form-data.',
        }),
      };
    }

    // Parse the multipart data
    const body = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    const parts = body.toString().split(`--${boundary}`);
    
    let fileData = null;
    let fileName = null;
    let fileType = null;

    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data')) {
        const nameMatch = part.match(/name="([^"]+)"/);
        const filenameMatch = part.match(/filename="([^"]+)"/);
        const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);
        
        if (filenameMatch && nameMatch && nameMatch[1] === 'image') {
          fileName = filenameMatch[1];
          fileType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
          
          // Extract file content (everything after the headers)
          const contentStart = part.indexOf('\r\n\r\n') + 4;
          const contentEnd = part.lastIndexOf('\r\n');
          fileData = part.substring(contentStart, contentEnd);
        }
      }
    }

    if (!fileData || !fileName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'No file uploaded or upload error occurred.',
        }),
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = fileName.toLowerCase().split('.').pop();

    if (!allowedExtensions.includes(fileExtension)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.',
        }),
      };
    }

    if (!allowedTypes.includes(fileType.toLowerCase())) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.',
        }),
      };
    }

    // Validate file size (max 10MB)
    const fileSize = Buffer.byteLength(fileData, 'base64');
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (fileSize > maxFileSize) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'File is too large. Maximum file size is 10MB.',
        }),
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const sanitizedOriginalName = fileName.replace(/[^a-z0-9_-]/gi, '_').substring(0, 50);
    const newFileName = `${sanitizedOriginalName}_${timestamp}_${randomString}.${fileExtension}`;

    // Set upload directory (relative to project root)
    const uploadDir = path.join(process.cwd(), 'Assets', 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
    }

    // Convert base64 to buffer and save file
    const fileBuffer = Buffer.from(fileData, 'base64');
    const filePath = path.join(uploadDir, newFileName);
    
    fs.writeFileSync(filePath, fileBuffer);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        path: `Assets/uploads/${newFileName}`,
        fileName: newFileName,
        fileSize: fileSize,
      }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: `Upload failed: ${error.message}`,
      }),
    };
  }
};

