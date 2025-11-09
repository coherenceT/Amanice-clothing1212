<?php
/**
 * Database Connection Configuration
 * 
 * This file handles the MySQL database connection for AMA-NICE CLOTHING.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Update the database credentials below with your Hostking MySQL details
 * 2. Ensure the database and user are created in cPanel (see SETUP.md)
 * 3. Test the connection by accessing this file directly in a browser
 * 
 * SECURITY NOTE:
 * - Keep this file outside the public web root if possible
 * - Never commit actual credentials to version control
 * - Use environment variables in production
 */

// Database configuration
// Hostking MySQL credentials
$servername = "localhost";
$username = "acvlvqmw_ama_nice_db";
$password = "Rzx8q6f8nHbyTKw7JX6t";
$dbname = "acvlvqmw_ama_nice_db";

// Create connection using mysqli
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Log error (don't expose sensitive info to users)
    error_log("Database connection failed: " . $conn->connect_error);
    
    // Set $conn to null so calling code can handle the error
    $conn = null;
    
    // If this is a web request (not CLI), send error response
    if (php_sapi_name() !== 'cli') {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Database connection failed. Please check your configuration.'
        ]);
        exit;
    }
} else {
    // Set charset to utf8mb4 for proper UTF-8 support (emojis, special characters)
    $conn->set_charset("utf8mb4");
}

// Note: When using require_once, $conn will be available in the calling file
// Calling files should check if $conn is null before using it

?>

