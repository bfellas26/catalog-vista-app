# Business Settings API Contract

Base URL:
`http://127.0.0.1:5001/digital-catalog-saas/us-central1/api`

## 1. Create Business Settings

`POST /business-settings/create`

### Request Body
```json
{
  "accountId": "string",
  "brandName": "string",
  "businessLogo": "string",
  "bannerImage": "string",
  "businessPunchline": "string",
  "whatsAppNumber": "string",
  "emailAddress": "string",
  "country": "string",
  "state": "string",
  "city": "string",
  "address": "string",
  "instagramLink": "string",
  "facebookLink": "string"
}
```

### Success Response
- Status: `201 Created`
```json
{
  "success": true,
  "message": "Business Settings created successfully",
  "data": {
    "documentId": "string",
    "accountId": "string"
  }
}
```

### Error Responses
- `400` - accountId or brandName missing
- `409` - business settings already exist for this account

---

## 2. Get Business Settings by Account ID

`GET /business-settings/:accountId`

### Example
`GET /business-settings/ACCOUNT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Business Settings fetched successfully",
  "data": {
    "documentId": "string",
    "accountId": "string",
    "brandName": "string",
    "businessLogo": "string",
    "bannerImage": "string",
    "businessPunchline": "string",
    "whatsAppNumber": "string",
    "emailAddress": "string",
    "country": "string",
    "state": "string",
    "city": "string",
    "address": "string",
    "instagramLink": "string",
    "facebookLink": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "createdBy": "string",
    "updatedBy": "string",
    "isDeleted": false
  }
}
```

### Error Response
- `404` - business settings not found

---

## 3. Update Business Settings

`PUT /business-settings/update/:accountId`

### Example
`PUT /business-settings/update/ACCOUNT123`

### Request Body
```json
{
  "brandName": "string",
  "businessLogo": "string",
  "bannerImage": "string",
  "businessPunchline": "string",
  "whatsAppNumber": "string",
  "emailAddress": "string",
  "country": "string",
  "state": "string",
  "city": "string",
  "address": "string",
  "instagramLink": "string",
  "facebookLink": "string"
}
```

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Business Settings updated successfully",
  "data": null
}
```

### Error Response
- `404` - business settings not found

---

## 4. Delete Business Settings (Soft Delete)

`PATCH /business-settings/delete/:accountId`

### Example
`PATCH /business-settings/delete/ACCOUNT123`

### Success Response
- Status: `200 OK`
```json
{
  "success": true,
  "message": "Business Settings deleted successfully",
  "data": null
}
```

### Error Response
- `404` - business settings not found

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
