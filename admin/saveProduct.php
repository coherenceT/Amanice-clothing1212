<?php
/**
 * Save Product API Endpoint
 * 
 * This endpoint saves a new product to the database.
 * 
 * USAGE:
 * POST /admin/saveProduct.php
 * 
 * POST DATA:
 * - type: Product type (required)
 * - category: Product category - men/women/kids (required)
 * - price: Product price (optional)
 * - priceRange: Price range string (optional)
 * - description: Product description (optional)
 * - image: Image path/URL (required)
 * - stockQuantity: Stock quantity (optional, default 0)
 * - stockNumber: Stock number (optional)
 * - gender: Gender - male/female/unisex (optional)
 * - size: Size (optional)
 * - isShoe: Whether product is a shoe (optional, default false)
 * - shoeBrand: Shoe brand (optional)
 * - shoeSizes: JSON array of shoe sizes (optional)
 * 
 * RETURNS:
 * JSON: { "status": "success", "id": product_id } or { "status": "error", "message": "..." }
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
    // Get POST data (handle both form-data and JSON)
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If JSON decode failed, try $_POST
    if ($input === null) {
        $input = $_POST;
    }
    
    // Validate required fields
    if (empty($input['type'])) {
        throw new Exception("Product type is required");
    }
    
    if (empty($input['category'])) {
        throw new Exception("Product category is required");
    }
    
    if (empty($input['image'])) {
        throw new Exception("Product image is required");
    }
    
    // Prepare data with defaults
    $type = $conn->real_escape_string($input['type'] ?? '');
    $category = strtolower($conn->real_escape_string($input['category'] ?? ''));
    $price = isset($input['price']) ? (float)$input['price'] : null;
    $priceRange = $conn->real_escape_string($input['priceRange'] ?? $input['price_range'] ?? '');
    $description = $conn->real_escape_string($input['description'] ?? '');
    $image = $conn->real_escape_string($input['image'] ?? $input['imagePath'] ?? '');
    $stockQuantity = isset($input['stockQuantity']) ? (int)$input['stockQuantity'] : (isset($input['stock_quantity']) ? (int)$input['stock_quantity'] : 0);
    $stockNumber = $conn->real_escape_string($input['stockNumber'] ?? $input['stock_number'] ?? '');
    $gender = $conn->real_escape_string($input['gender'] ?? '');
    $size = $conn->real_escape_string($input['size'] ?? '');
    $isShoe = isset($input['isShoe']) ? (bool)$input['isShoe'] : (isset($input['is_shoe']) ? (bool)$input['is_shoe'] : false);
    $shoeBrand = isset($input['shoeBrand']) ? $conn->real_escape_string($input['shoeBrand']) : (isset($input['shoe_brand']) ? $conn->real_escape_string($input['shoe_brand']) : null);
    
    // Handle shoe sizes (should be JSON array)
    $shoeSizes = [];
    if (isset($input['shoeSizes'])) {
        $shoeSizes = is_array($input['shoeSizes']) ? $input['shoeSizes'] : json_decode($input['shoeSizes'], true);
    } elseif (isset($input['shoe_sizes'])) {
        $shoeSizes = is_array($input['shoe_sizes']) ? $input['shoe_sizes'] : json_decode($input['shoe_sizes'], true);
    }
    $shoeSizesJson = !empty($shoeSizes) ? $conn->real_escape_string(json_encode($shoeSizes)) : null;
    
    // Validate category
    $allowedCategories = ['men', 'women', 'kids'];
    if (!in_array($category, $allowedCategories)) {
        throw new Exception("Invalid category. Must be one of: " . implode(', ', $allowedCategories));
    }
    
    // Prepare SQL statement
    $sql = "INSERT INTO products (
        type, category, price, price_range, description, image, 
        stock_quantity, stock_number, gender, size, is_shoe, 
        shoe_brand, shoe_sizes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Bind parameters
    $stmt->bind_param(
        "ssdssissssiss",
        $type,
        $category,
        $price,
        $priceRange,
        $description,
        $image,
        $stockQuantity,
        $stockNumber,
        $gender,
        $size,
        $isShoe,
        $shoeBrand,
        $shoeSizesJson
    );
    
    // Execute statement
    if ($stmt->execute() === false) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    // Get the ID of the newly inserted product
    $newProductId = $conn->insert_id;
    
    // Close statement
    $stmt->close();
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'id' => $newProductId,
        'message' => 'Product saved successfully'
    ]);
    
} catch (Exception $e) {
    // Log error
    error_log("Save product error: " . $e->getMessage());
    
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

