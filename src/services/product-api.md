# Product API Contract

Base URL:
`http://127.0.0.1:5001/digital-catalog-saas/us-central1/api`

## 1. Create Product

`POST /products/create`

### Request Body
```json
{
  "accountId": "string",
  "categoryId": "string",
  "productName": "string",
  "productDescription": "string",
  "productPrice": 0,
  "productImages": ["image_url_1", "image_url_2"],
  "productTags": ["tag_id_1", "tag_id_2"],
  "displayOrder": 1
}
```

> If `categoryId` is not provided, the product is treated as a standalone product.

### Success Response
- Status: `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "documentId": "string",
    "accountId": "string"
  }
}
```

### Error Responses
- `400` - accountId or productName missing, invalid image array, invalid tag array, or too many images (>5)
- `404` - invalid category or invalid product tag
- `409` - product already exists for the account

---

## 2. Get All Products

`GET /products/list/:accountId`

### Example
`GET /products/list/ACCOUNT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "documentId": "string",
      "accountId": "string",
      "categoryId": "string",
      "productName": "string",
      "productDescription": "string",
      "productPrice": 0,
      "productImages": ["string"],
      "productTags": ["string"],
      "displayOrder": 1,
      "isStandalone": true,
      "isActive": true,
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "createdBy": "string",
      "updatedBy": "string",
      "isDeleted": false
    }
  ]
}
```

### Error Responses
- `400` - accountId is required

---

## 3. Get Standalone Products

`GET /products/standalone/:accountId`

### Example
`GET /products/standalone/ACCOUNT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Standalone products fetched successfully",
  "data": [
    {
      "documentId": "string",
      "accountId": "string",
      "categoryId": "",
      "productName": "string",
      "productDescription": "string",
      "productPrice": 0,
      "productImages": ["string"],
      "productTags": ["string"],
      "displayOrder": 1,
      "isStandalone": true,
      "isActive": true,
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "createdBy": "string",
      "updatedBy": "string",
      "isDeleted": false
    }
  ]
}
```

### Error Responses
- `400` - accountId is required

---

## 4. Get Products by Category

`GET /products/category/:categoryId`

### Example
`GET /products/category/CATEGORY123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Category products fetched successfully",
  "data": [
    {
      "documentId": "string",
      "accountId": "string",
      "categoryId": "string",
      "productName": "string",
      "productDescription": "string",
      "productPrice": 0,
      "productImages": ["string"],
      "productTags": ["string"],
      "displayOrder": 1,
      "isStandalone": false,
      "isActive": true,
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "createdBy": "string",
      "updatedBy": "string",
      "isDeleted": false
    }
  ]
}
```

---

## 5. Get Product by Product ID

`GET /products/:productId`

### Example
`GET /products/PRODUCT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "documentId": "string",
    "accountId": "string",
    "categoryId": "string",
    "productName": "string",
    "productDescription": "string",
    "productPrice": 0,
    "productImages": ["string"],
    "productTags": ["string"],
    "displayOrder": 1,
    "isStandalone": true,
    "isActive": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "createdBy": "string",
    "updatedBy": "string",
    "isDeleted": false
  }
}
```

### Error Response
- `404` - product not found

---

## 6. Update Product

`PUT /products/update/:productId`

### Request Body
```json
{
  "categoryId": "string",
  "productName": "string",
  "productDescription": "string",
  "productPrice": 0,
  "productImages": ["image_url_1", "image_url_2"],
  "productTags": ["tag_id_1", "tag_id_2"],
  "displayOrder": 1
}
```

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": null
}
```

### Error Response
- `404` - product not found

---

## 7. Delete Product (Soft Delete)

`PATCH /products/delete/:productId`

### Example
`PATCH /products/delete/PRODUCT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

### Error Response
- `404` - product not found

---

## 8. Enable / Disable Product

`PATCH /products/status/:productId`

### Request Body
```json
{
  "isActive": true
}
```

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Product status updated successfully",
  "data": null
}
```

### Error Responses
- `400` - status is required
- `404` - product not found

---

## Response Envelope
All responses follow this JSON structure:
```json
{
  "success": true,
  "message": "string",
  "data": null | {} | []
}
```
