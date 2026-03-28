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
