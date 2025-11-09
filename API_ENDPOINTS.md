# API Endpoints Reference

This document describes all the PHP API endpoints for the AMA-NICE CLOTHING database system.

## Base URL

All endpoints are located in the `/admin/` directory:
- `https://yourdomain.com/admin/getProducts.php`
- `https://yourdomain.com/admin/saveProduct.php`
- `https://yourdomain.com/admin/updateProduct.php`
- `https://yourdomain.com/admin/deleteProduct.php`

---

## 📥 GET Products

### Endpoint
```
GET /admin/getProducts.php
```

### Description
Retrieves all products from the database.

### Request
- Method: `GET`
- Headers: None required
- Body: None

### Response
```json
[
  {
    "id": "1",
    "type": "T-Shirt",
    "category": "men",
    "gender": "male",
    "price": 100.00,
    "priceRange": "R50 - R150",
    "description": "Comfortable cotton t-shirt",
    "image": "Assets/uploads/image.jpg",
    "imageURL": "Assets/uploads/image.jpg",
    "stockQuantity": 50,
    "stockNumber": "TS-001",
    "size": "",
    "isShoe": false,
    "shoeBrand": null,
    "shoeSizes": [],
    "isDefault": false,
    "dateAdded": "2024-01-15 10:30:00"
  }
]
```

### Status Codes
- `200` - Success
- `500` - Server error

### Testing
```bash
curl https://yourdomain.com/admin/getProducts.php
```

Or open in browser: `https://yourdomain.com/admin/getProducts.php`

---

## 💾 Save Product

### Endpoint
```
POST /admin/saveProduct.php
```

### Description
Creates a new product in the database.

### Request
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body: JSON object

#### Required Fields
- `type` (string) - Product type
- `category` (string) - Category: "men", "women", or "kids"
- `image` (string) - Image path/URL

#### Optional Fields
- `price` (number) - Product price
- `priceRange` (string) - Price range
- `description` (string) - Product description
- `stockQuantity` (number) - Stock quantity (default: 0)
- `stockNumber` (string) - Stock number
- `gender` (string) - Gender: "male", "female", or "unisex"
- `size` (string) - Product size
- `isShoe` (boolean) - Whether product is a shoe (default: false)
- `shoeBrand` (string) - Shoe brand
- `shoeSizes` (array) - Array of shoe sizes with quantities

### Request Example
```json
{
  "type": "Sneakers",
  "category": "men",
  "price": 500,
  "priceRange": "R100 - R790",
  "description": "Comfortable running sneakers",
  "image": "Assets/uploads/sneakers.jpg",
  "stockQuantity": 25,
  "stockNumber": "SN-001",
  "gender": "male",
  "isShoe": true,
  "shoeBrand": "Nike",
  "shoeSizes": [
    {"size": "8", "qty": 5},
    {"size": "9", "qty": 10},
    {"size": "10", "qty": 10}
  ]
}
```

### Response
```json
{
  "status": "success",
  "id": 1,
  "message": "Product saved successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Product type is required"
}
```

### Status Codes
- `200` - Success
- `400` - Bad request (validation error)
- `405` - Method not allowed
- `500` - Server error

### Testing
```bash
curl -X POST https://yourdomain.com/admin/saveProduct.php \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Test Product",
    "category": "men",
    "image": "Assets/images/test.jpg",
    "price": 100,
    "description": "Test description"
  }'
```

---

## ✏️ Update Product

### Endpoint
```
POST /admin/updateProduct.php
```

### Description
Updates an existing product in the database.

### Request
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body: JSON object

#### Required Fields
- `id` (number) - Product ID to update

#### Optional Fields
- All fields from saveProduct.php (only include fields you want to update)

### Request Example
```json
{
  "id": 1,
  "price": 120,
  "stockQuantity": 30,
  "description": "Updated description"
}
```

### Response
```json
{
  "status": "success",
  "message": "Product updated successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Product not found"
}
```

### Status Codes
- `200` - Success
- `400` - Bad request (validation error)
- `405` - Method not allowed
- `500` - Server error

### Testing
```bash
curl -X POST https://yourdomain.com/admin/updateProduct.php \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "price": 120,
    "stockQuantity": 30
  }'
```

---

## 🗑️ Delete Product

### Endpoint
```
POST /admin/deleteProduct.php
```

### Description
Deletes a product from the database.

### Request
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body: JSON object

#### Required Fields
- `id` (number) - Product ID to delete

### Request Example
```json
{
  "id": 1
}
```

### Response
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Product not found"
}
```

### Status Codes
- `200` - Success
- `400` - Bad request (validation error)
- `405` - Method not allowed
- `500` - Server error

### Testing
```bash
curl -X POST https://yourdomain.com/admin/deleteProduct.php \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```

---

## 🔒 CORS Headers

All endpoints include CORS headers to allow cross-origin requests:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 🧪 Testing Endpoints

### Using Browser Console

```javascript
// Get all products
fetch('/admin/getProducts.php')
  .then(r => r.json())
  .then(data => console.log(data));

// Save a product
fetch('/admin/saveProduct.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    type: 'Test Product',
    category: 'men',
    image: 'Assets/images/test.jpg',
    price: 100
  })
})
.then(r => r.json())
.then(data => console.log(data));

// Update a product
fetch('/admin/updateProduct.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    id: 1,
    price: 120
  })
})
.then(r => r.json())
.then(data => console.log(data));

// Delete a product
fetch('/admin/deleteProduct.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({id: 1})
})
.then(r => r.json())
.then(data => console.log(data));
```

### Using Postman

1. Set method to `POST` (except for getProducts.php which is `GET`)
2. Set URL to endpoint
3. Go to Headers tab
4. Add header: `Content-Type: application/json`
5. Go to Body tab
6. Select "raw" and "JSON"
7. Enter JSON data
8. Click Send

---

## 📝 Notes

1. **Error Handling**: All endpoints return JSON with `status: "error"` and a `message` field on errors.

2. **Validation**: 
   - Required fields are validated
   - Category must be "men", "women", or "kids"
   - Product ID must exist for update/delete operations

3. **Security**:
   - All inputs are sanitized using `real_escape_string()`
   - Prepared statements prevent SQL injection
   - Error messages don't expose sensitive information

4. **Image Paths**: 
   - Can be relative paths: `Assets/uploads/image.jpg`
   - Can be data URLs: `data:image/jpeg;base64,...`
   - Can be full URLs: `https://example.com/image.jpg`

5. **Shoe Sizes**: 
   - Should be JSON array: `[{"size": "8", "qty": 5}, {"size": "9", "qty": 10}]`
   - Stored as JSON string in database

---

## 🐛 Common Issues

### "Database connection failed"
- Check `db_connect.php` credentials
- Verify database exists
- Check user privileges

### "Product not found"
- Verify product ID exists
- Check database for product

### "Method not allowed"
- Ensure using POST for save/update/delete
- Check if OPTIONS request is handled (preflight)

### "Invalid category"
- Category must be exactly: "men", "women", or "kids"
- Case-sensitive

---

## 📞 Support

For issues or questions:
1. Check DATABASE_SETUP.md for setup instructions
2. Review PHP error logs
3. Test endpoints individually
4. Verify database connection

