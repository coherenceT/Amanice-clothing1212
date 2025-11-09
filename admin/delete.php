<?php
/**
 * Image Deletion Handler for AMA-NICE CLOTHING Admin Dashboard
 * 
 * This script handles deletion of product images from the server.
 * Can delete images from both Assets/uploads/ and Assets/images/ directories.
 * 
 * Accepts POST requests with image path.
 * Returns JSON response with status.
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if image path is provided
if (!isset($input['imagePath']) || empty($input['imagePath'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Image path is required.'
    ]);
    exit;
}

$imagePath = $input['imagePath'];

// Security: Only allow deletion from Assets/uploads/ and Assets/images/ directories
// Prevent directory traversal attacks
$allowedPrefixes = ['Assets/uploads/', 'Assets/images/'];
$isAllowed = false;

foreach ($allowedPrefixes as $prefix) {
    if (strpos($imagePath, $prefix) === 0) {
        $isAllowed = true;
        break;
    }
}

if (!$isAllowed) {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid path. Only images in Assets/uploads/ or Assets/images/ can be deleted.'
    ]);
    exit;
}

// Get full file path (relative to project root)
$projectRoot = dirname(__DIR__);
$fullPath = $projectRoot . '/' . $imagePath;

// Normalize path to prevent directory traversal
$realPath = realpath($fullPath);
$allowedDir1 = realpath($projectRoot . '/Assets/uploads');
$allowedDir2 = realpath($projectRoot . '/Assets/images');

// Security check: ensure file is actually within allowed directories
if ($realPath === false || 
    (strpos($realPath, $allowedDir1) !== 0 && strpos($realPath, $allowedDir2) !== 0)) {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid file path. Security check failed.'
    ]);
    exit;
}

// Check if file exists
if (!file_exists($realPath)) {
    http_response_code(404);
    echo json_encode([
        'status' => 'error',
        'message' => 'File not found.'
    ]);
    exit;
}

// Verify it's actually a file (not a directory)
if (!is_file($realPath)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Path is not a file.'
    ]);
    exit;
}

// Verify it's an image file
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$fileExtension = strtolower(pathinfo($realPath, PATHINFO_EXTENSION));

if (!in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'File is not an image.'
    ]);
    exit;
}

// Delete the file
if (!unlink($realPath)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to delete file. Please check file permissions.'
    ]);
    exit;
}

// Verify file was deleted
if (file_exists($realPath)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'File deletion verification failed. File may still exist.'
    ]);
    exit;
}

// Return success response
echo json_encode([
    'status' => 'success',
    'message' => 'Image deleted successfully.',
    'deletedPath' => $imagePath
]);

?>

