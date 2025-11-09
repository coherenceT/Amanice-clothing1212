<?php
/**
 * Get Products API Endpoint
 * 
 * This endpoint retrieves all products from the database.
 * 
 * USAGE:
 * GET /admin/getProducts.php
 * 
 * RETURNS:
 * JSON array of products
 * 
 * CORS:
 * Allows requests from any origin (configure for production)
 */

// Set CORS headers to allow frontend access
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection
require_once __DIR__ . '/db_connect.php';

try {
    // Query to get all products, ordered by created_at (newest first)
    $sql = "SELECT * FROM products ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    if ($result === false) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    // Fetch all products as associative array
    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Convert database row to product object matching frontend structure
        $product = [
            'id' => (string)$row['id'], // Convert to string for consistency
            'type' => $row['type'] ?? '',
            'category' => $row['category'] ?? '',
            'gender' => $row['gender'] ?? '',
            'price' => isset($row['price']) ? (float)$row['price'] : null,
            'priceRange' => $row['price_range'] ?? '',
            'description' => $row['description'] ?? '',
            'image' => $row['image'] ?? '',
            'imageURL' => $row['image'] ?? '', // Alias for compatibility
            'stockQuantity' => isset($row['stock_quantity']) ? (int)$row['stock_quantity'] : 0,
            'stockNumber' => $row['stock_number'] ?? '',
            'isShoe' => isset($row['is_shoe']) ? (bool)$row['is_shoe'] : false,
            'shoeBrand' => $row['shoe_brand'] ?? null,
            'shoeSizes' => !empty($row['shoe_sizes']) ? json_decode($row['shoe_sizes'], true) : [],
            'size' => $row['size'] ?? '',
            'isDefault' => false, // Database products are never default
            'dateAdded' => $row['created_at'] ?? date('Y-m-d H:i:s')
        ];
        
        $products[] = $product;
    }
    
    // Return products as JSON
    echo json_encode($products);
    
} catch (Exception $e) {
    // Log error
    error_log("Get products error: " . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to retrieve products: ' . $e->getMessage()
    ]);
} finally {
    // Close connection
    if (isset($conn)) {
        $conn->close();
    }
}

?>

