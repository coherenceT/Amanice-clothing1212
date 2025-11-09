<?php
/**
 * Update Product API Endpoint
 * 
 * This endpoint updates an existing product in the database.
 * 
 * USAGE:
 * POST /admin/updateProduct.php
 * 
 * POST DATA:
 * - id: Product ID (required)
 * - (all other fields same as saveProduct.php, all optional)
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
    $checkSql = "SELECT id FROM products WHERE id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("i", $productId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        $checkStmt->close();
        throw new Exception("Product not found");
    }
    $checkStmt->close();
    
    // Build update query dynamically based on provided fields
    $updates = [];
    $types = '';
    $values = [];
    
    // List of updatable fields
    $fields = [
        'type' => 's',
        'category' => 's',
        'price' => 'd',
        'priceRange' => 's',
        'price_range' => 's',
        'description' => 's',
        'image' => 's',
        'imagePath' => 's',
        'stockQuantity' => 'i',
        'stock_quantity' => 'i',
        'stockNumber' => 's',
        'stock_number' => 's',
        'gender' => 's',
        'size' => 's',
        'isShoe' => 'i',
        'is_shoe' => 'i',
        'shoeBrand' => 's',
        'shoe_brand' => 's',
        'shoeSizes' => 's',
        'shoe_sizes' => 's'
    ];
    
    // Process each field
    foreach ($fields as $field => $type) {
        if (isset($input[$field])) {
            // Map frontend field names to database column names
            $dbField = str_replace(['priceRange', 'stockQuantity', 'stockNumber', 'isShoe', 'shoeBrand', 'shoeSizes', 'imagePath'], 
                                  ['price_range', 'stock_quantity', 'stock_number', 'is_shoe', 'shoe_brand', 'shoe_sizes', 'image'],
                                  $field);
            
            if ($dbField === 'shoe_sizes') {
                // Handle shoe sizes as JSON
                $shoeSizes = is_array($input[$field]) ? $input[$field] : json_decode($input[$field], true);
                $updates[] = "$dbField = ?";
                $types .= 's';
                $values[] = !empty($shoeSizes) ? json_encode($shoeSizes) : null;
            } elseif ($dbField === 'is_shoe') {
                // Handle boolean
                $updates[] = "$dbField = ?";
                $types .= 'i';
                $values[] = (bool)$input[$field] ? 1 : 0;
            } elseif ($dbField === 'price') {
                // Handle float
                $updates[] = "$dbField = ?";
                $types .= 'd';
                $values[] = (float)$input[$field];
            } elseif ($type === 'i') {
                // Handle integer
                $updates[] = "$dbField = ?";
                $types .= 'i';
                $values[] = (int)$input[$field];
            } else {
                // Handle string
                $updates[] = "$dbField = ?";
                $types .= 's';
                $values[] = $conn->real_escape_string($input[$field]);
            }
        }
    }
    
    // If no fields to update
    if (empty($updates)) {
        throw new Exception("No fields to update");
    }
    
    // Handle category validation if provided
    if (isset($input['category'])) {
        $category = strtolower($input['category']);
        $allowedCategories = ['men', 'women', 'kids'];
        if (!in_array($category, $allowedCategories)) {
            throw new Exception("Invalid category. Must be one of: " . implode(', ', $allowedCategories));
        }
    }
    
    // Build SQL query
    $sql = "UPDATE products SET " . implode(', ', $updates) . " WHERE id = ?";
    $types .= 'i'; // Add type for ID parameter
    $values[] = $productId;
    
    // Prepare and execute
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Bind parameters dynamically
    $stmt->bind_param($types, ...$values);
    
    if ($stmt->execute() === false) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    // Close statement
    $stmt->close();
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Product updated successfully'
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log("Update product error: " . $e->getMessage());
    
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

