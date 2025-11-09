<?php
/**
 * File Upload Handler for AMA-NICE CLOTHING Admin Dashboard
 * 
 * This script handles image file uploads from the admin dashboard.
 * Uploaded images are saved to the Assets/uploads/ directory.
 * 
 * Accepts POST requests with a file field named "image".
 * Returns JSON response with status and file path.
 */

// Set headers for JSON response and CORS support
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $errorMessage = 'No file uploaded or upload error occurred.';
    
    // Provide more specific error messages
    if (isset($_FILES['image']['error'])) {
        switch ($_FILES['image']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMessage = 'File is too large. Maximum upload size exceeded.';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMessage = 'File was only partially uploaded.';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMessage = 'No file was uploaded.';
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                $errorMessage = 'Missing temporary folder.';
                break;
            case UPLOAD_ERR_CANT_WRITE:
                $errorMessage = 'Failed to write file to disk.';
                break;
            case UPLOAD_ERR_EXTENSION:
                $errorMessage = 'A PHP extension stopped the file upload.';
                break;
        }
    }
    
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $errorMessage
    ]);
    exit;
}

$file = $_FILES['image'];

// Validate file type - allow common image formats
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

// Get file info
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];
$fileType = $file['type'];

// Validate MIME type
if (!in_array(strtolower($fileType), array_map('strtolower', $allowedTypes))) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'
    ]);
    exit;
}

// Get file extension
$fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// Validate extension
if (!in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.'
    ]);
    exit;
}

// Validate file size (max 10MB)
$maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
if ($fileSize > $maxFileSize) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'File is too large. Maximum file size is 10MB.'
    ]);
    exit;
}

// Validate that it's actually an image
$imageInfo = @getimagesize($fileTmpName);
if ($imageInfo === false) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid image file. The uploaded file is not a valid image.'
    ]);
    exit;
}

// Generate unique filename to prevent overwrites
$timestamp = time();
$randomString = bin2hex(random_bytes(4)); // 8 character random string
$sanitizedOriginalName = preg_replace('/[^a-z0-9_-]/i', '_', pathinfo($fileName, PATHINFO_FILENAME));
$sanitizedOriginalName = substr($sanitizedOriginalName, 0, 50); // Limit length
$newFileName = $sanitizedOriginalName . '_' . $timestamp . '_' . $randomString . '.' . $fileExtension;

// Set upload directory (Assets/uploads folder, two levels up from admin/)
$uploadDir = dirname(__DIR__) . '/Assets/uploads/';

// Check if Assets/uploads directory exists, create if not
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create Assets/uploads directory. Please check permissions.'
        ]);
        exit;
    }
}

// Check if directory is writable
if (!is_writable($uploadDir)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Assets/uploads directory is not writable. Please check permissions.'
    ]);
    exit;
}

// Full path for the uploaded file
$targetPath = $uploadDir . $newFileName;

// Move uploaded file to target directory
if (!move_uploaded_file($fileTmpName, $targetPath)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to save uploaded file. Please try again.'
    ]);
    exit;
}

// Verify file was saved
if (!file_exists($targetPath)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'File upload verification failed. File may not have been saved correctly.'
    ]);
    exit;
}

// Return success response with file path (relative path from project root)
echo json_encode([
    'status' => 'success',
    'path' => 'Assets/uploads/' . $newFileName,
    'fileName' => $newFileName,
    'fileSize' => $fileSize
]);

?>
