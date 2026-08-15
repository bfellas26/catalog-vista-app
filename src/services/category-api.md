# Category API Contract

Base URL:
`http://127.0.0.1:5001/digital-catalog-saas/us-central1/api`

## 1. Create Category

`POST /categories/create`

### Request Body
```json
{
  "accountId": "string",
  "categoryName": "string",
  "categoryImage": "string",
  "categoryDescription": "string",
  "displayOrder": 1
}
```

### Success Response
- Status: `201 Created`
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "documentId": "string",
    "accountId": "string"
  }
}
```

### Error Responses
- `400` - accountId or categoryName missing
- `409` - category already exists for the account

---

## 2. Get All Categories

`GET /categories/list/:accountId`

### Example
`GET /categories/list/ACCOUNT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "documentId": "string",
      "accountId": "string",
      "categoryName": "string",
      "categoryImage": "string",
      "categoryDescription": "string",
      "displayOrder": 1,
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
- `400` - accountId missing

---

## 3. Get Category By ID

`GET /categories/:categoryId`

### Example
`GET /categories/CATEGORY123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Category fetched successfully",
  "data": {
    "documentId": "string",
    "accountId": "string",
    "categoryName": "string",
    "categoryImage": "string",
    "categoryDescription": "string",
    "displayOrder": 1,
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
- `404` - category not found

---

## 4. Update Category

`PUT /categories/update/:categoryId`

### Example
`PUT /categories/update/CATEGORY123`

### Request Body
```json
{
  "categoryName": "string",
  "categoryImage": "string",
  "categoryDescription": "string",
  "displayOrder": 1
}
```

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": null
}
```

### Error Response
- `404` - category not found

---

## 5. Delete Category

`PATCH /categories/delete/:categoryId`

### Example
`PATCH /categories/delete/CATEGORY123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

### Error Response
- `404` - category not found

---

## 6. Enable / Disable Category

`PATCH /categories/status/:categoryId`

### Example
`PATCH /categories/status/CATEGORY123`

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
  "message": "Category status updated successfully",
  "data": null
}
```

### Error Response
- `404` - category not found

---

## Response Envelope
All responses follow this JSON structure:
```json
{
  "success": true,
  "message": "string",
  "data": ...
}
```

## Notes
- Category names are unique per account.
- This module supports soft delete and status toggle.
# Category API Contract

Base URL:
`http://127.0.0.1:5001/digital-catalog-saas/us-central1/api`

## 1. Create Category

`POST /categories/create`

### Request Body
```json
{
  "accountId": "string",
  "categoryName": "string",
  "categoryImage": "string",
  "categoryDescription": "string",
  "displayOrder": 1
}
```

### Success Response
- Status: `201 Created`
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "documentId": "string",
    "accountId": "string"
  }
}
```

### Error Responses
- `400` - accountId or categoryName missing
- `409` - category already exists

---

## 2. Get All Categories

`GET /categories/list/:accountId`

### Example
`GET /categories/list/ACCOUNT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "documentId": "string",
      "accountId": "string",
      "categoryName": "string",
      "categoryImage": "string",
      "categoryDescription": "string",
      "displayOrder": 1,
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

## 3. Get Category by Category ID

`GET /categories/:categoryId`

### Example
`GET /categories/CATEGORY123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Category fetched successfully",
  "data": {
    "documentId": "string",
    "accountId": "string",
    "categoryName": "string",
    "categoryImage": "string",
    "categoryDescription": "string",
    "displayOrder": 1,
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
- `404` - category not found

---

## 4. Update Category

`PUT /categories/update/:categoryId`

### Request Body
```json
{
  "categoryName": "string",
  "categoryImage": "string",
  "categoryDescription": "string",
  "displayOrder": 1
}
```

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": null
}
```

### Error Response
- `404` - category not found

---

## 5. Delete Category (Soft Delete)

`PATCH /categories/delete/:categoryId`

### Example
`PATCH /categories/delete/CATEGORY123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

### Error Response
- `404` - category not found

---

## 6. Enable / Disable Category

`PATCH /categories/status/:categoryId`

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
  "message": "Category status updated successfully",
  "data": null
}
```

### Error Responses
- `400` - status is required
- `404` - category not found

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
