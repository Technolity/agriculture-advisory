# 📡 API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production:  TBD
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### 🔐 Auth

#### POST `/auth/register`
Register a new user account.
```json
// Request Body
{
  "email": "farmer@example.com",
  "phone": "+92XXXXXXXXXX",
  "password": "securePassword123",
  "name": "Ahmed Khan",
  "language": "ur",
  "region": "kashmir",
  "latitude": 34.0837,
  "longitude": 74.7973
}

// Response 201
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "..." },
    "token": "jwt_token_here"
  }
}
```

#### POST `/auth/login`
```json
// Request Body
{ "email": "farmer@example.com", "password": "securePassword123" }

// Response 200
{
  "success": true,
  "data": { "user": {...}, "token": "jwt_token_here" }
}
```

---

### 🌾 Crops

#### GET `/crops`
List all crops. Supports filtering by region and season.
```
GET /crops?region=kashmir&season=rabi
```

#### GET `/crops/:id/diseases`
List diseases for a specific crop.
```
GET /crops/uuid/diseases
```

---

### 🔬 Disease Detection

#### POST `/diseases/detect`
Upload image for disease classification.
```
Content-Type: multipart/form-data
- image: File (max 500KB, JPG/PNG)
- crop_id: string (optional)

// Response 200
{
  "success": true,
  "data": {
    "disease": { "id": "uuid", "name": "Late Blight", "confidence": 0.92 },
    "treatment": "Apply copper-based fungicide...",
    "severity": "high"
  }
}
```

---

### 🌤️ Weather

#### GET `/weather`
Get weather data by coordinates.
```
GET /weather?latitude=34.08&longitude=74.79
```

---

### 💰 Market Prices

#### GET `/prices`
Get market prices for crops in a region.
```
GET /prices?region=Kashmir&crop_ids=id1,id2
```

---

### 🔄 Sync

#### POST `/sync/queue`
Process offline queue items.
```json
// Request Body
{
  "items": [
    { "action_type": "disease_detection", "payload": {...}, "priority": 1 }
  ]
}
```

---

### 🛍️ Marketplace (NEW)

Direct farmer-to-buyer crop sales. Farmers list crops, buyers contact sellers directly. No payment processing.

#### GET `/marketplace/listings`
Browse marketplace listings with optional filters.
```
GET /marketplace/listings?region=Kashmir&cropId=uuid&minPrice=100&maxPrice=500&status=active&page=1&limit=20
```
**Query Parameters** (all optional):
- `region`: string - Filter by location
- `cropId`: uuid - Filter by crop type
- `minPrice`: number - Minimum price per unit
- `maxPrice`: number - Maximum price per unit
- `status`: enum(active|sold|expired) - Default: active
- `page`: number - Pagination (default: 1)
- `limit`: number - Per page (default: 20, max: 50)

**Response 200**:
```json
{
  "listings": [
    {
      "id": "uuid",
      "sellerId": "uuid",
      "cropId": "uuid",
      "crop": { "id": "...", "name": "Wheat", "nameUrdu": "گندم" },
      "quantity": 100,
      "unit": "kg",
      "pricePerUnit": 25.50,
      "location": "Srinagar",
      "description": "Organic wheat, harvested last week",
      "imageUrls": ["https://..."],
      "status": "active",
      "expiresAt": "2026-04-27T...",
      "createdAt": "2026-03-28T...",
      "seller": { "id": "...", "name": "Ahmed Khan", "region": "Kashmir" }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

#### POST `/marketplace/listings`
**Requires authentication.** Seller creates a new crop listing.
```json
// Request Body
{
  "cropId": "uuid",
  "quantity": 100,
  "unit": "kg",
  "pricePerUnit": 25.50,
  "location": "Srinagar, Kashmir",
  "description": "Premium organic wheat, fresh harvest",
  "contactPhone": "+92XXXXXXXXXX",
  "contactEmail": "farmer@example.com",
  "imageUrls": ["https://...image1.jpg", "https://...image2.jpg"]
}

// Response 201
{
  "id": "uuid",
  "sellerId": "uuid",
  "status": "active",
  "expiresAt": "2026-04-27T...",
  ...
}
```

#### GET `/marketplace/listings/:id`
Get details of a single listing.
```
GET /marketplace/listings/uuid
```
**Response 200**: Full listing object with seller info and offers count.

#### PUT `/marketplace/listings/:id`
**Requires authentication + ownership.** Update a listing (seller only).
```json
// Request Body (all optional)
{
  "quantity": 80,
  "pricePerUnit": 26.00,
  "status": "sold",
  "location": "...",
  "description": "..."
}

// Response 200: Updated listing
```

#### DELETE `/marketplace/listings/:id`
**Requires authentication + ownership.** Soft-delete a listing (sets status='expired').
```
DELETE /marketplace/listings/uuid

// Response 204 No Content
```

#### POST `/marketplace/listings/:id/contact`
**Requires authentication.** Buyer requests seller contact info. Returns seller's phone & email if listing is active.
```
POST /marketplace/listings/uuid/contact

// Response 200
{
  "sellerName": "Ahmed Khan",
  "contactPhone": "+92XXXXXXXXXX",
  "contactEmail": "farmer@example.com"
}
```

---

### ❤️ Health

#### GET `/health`
```json
// Response 200
{ "status": "ok", "timestamp": "2026-03-28T00:00:00Z", "version": "1.0.0" }
```

---

## Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [...]
  }
}
```

## Rate Limiting
- 100 requests per minute per user
- 429 Too Many Requests returned when exceeded
