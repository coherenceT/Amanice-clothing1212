<?php
/**
 * Delete Product API Endpoint
 * 
 * This endpoint deletes a product from the database.
 * 
 * USAGE:
 * POST /admin/deleteProduct.php
 * 
 * POST DATA:
 * - id: Product ID (required)
 * 
 * RETURNS:
 * JSON: { "status": "success" } or { "status": "error", "message": "..." }
 */

// Set CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

// Include database connection
require_once __DIR__ . '/db_connect.php';

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If JSON decode failed, try $_POST
    if ($input === null) {
        $input = $_POST;
    }
    
    // Validate required field
    if (empty($input['id'])) {
        throw new Exception("Product ID is required");
    }
    
    $productId = (int)$input['id'];
    
    // Check if product exists
    $checkSql = "SELECT id, image FROM products WHERE id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("i", $productId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        $checkStmt->close();
        throw new Exception("Product not found");
    }
    
    $product = $result->fetch_assoc();
    $checkStmt->close();
    
    // Delete product from database
    $sql = "DELETE FROM products WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("i", $productId);
    
    if ($stmt->execute() === false) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    // Close statement
    $stmt->close();
    
    // Optionally delete image file if it's a local file
    // (Uncomment and modify if you want to delete uploaded images)
    /*
    if (!empty($product['image']) && strpos($product['image'], 'Assets/uploads/') === 0) {
        $imagePath = dirname(__DIR__) . '/' . $product['image'];
        if (file_exists($imagePath)) {
            @unlink($imagePath);
        }
    }
    */
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Product deleted successfully'
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log("Delete product error: " . $e->getMessage());
    
    // Return error response
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    // Close connection
    if (isset($conn)) {
        $conn->close();
    }
}

?>

