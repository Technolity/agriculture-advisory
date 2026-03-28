# 🏗️ Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Mobile App (Expo)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Screens │ │Components│ │  Redux   │ │  SQLite  │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       └─────────────┴────────────┴─────────────┘             │
│                          │                                    │
│              ┌───────────┴───────────┐                       │
│              │   Sync Queue Engine   │                       │
│              └───────────┬───────────┘                       │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────┼──────────────────────────────────┐
│                   Backend (Express)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Routes  │ │Controllers│ │ Services │ │Middleware│       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       └─────────────┴────────────┴─────────────┘             │
│                          │                                    │
│              ┌───────────┴───────────┐                       │
│              │     Prisma ORM        │                       │
│              └───────────┬───────────┘                       │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │     PostgreSQL DB       │
              └─────────────────────────┘
```

## Data Flow

### Online Mode
1. User action → Redux dispatch → API call → Express route → Controller → Service → Prisma → DB
2. Response flows back through the chain
3. Redux state updates → UI re-renders

### Offline Mode
1. User action → Redux dispatch → SQLite local store
2. Action queued in sync_queue table
3. When connectivity restored → Sync service processes queue
4. Conflicts resolved via last-write-wins with user notification

## Key Patterns

### Offline-First Architecture
- All data cached locally in SQLite
- API calls wrapped with offline fallback
- Sync queue with priority-based processing
- Image deduplication via SHA256 hash

### Authentication
- JWT-based with refresh tokens
- Device ID binding for security
- Session management with expiry

### Error Handling
- Global error boundary (React Native)
- Express error middleware (backend)
- Structured error responses with codes
- Retry logic with exponential backoff

## Database Schema (10 Tables)
1. `users` - User accounts and preferences
2. `crops` - Crop reference data (multilingual)
3. `diseases` - Disease reference data linked to crops
4. `disease_detections` - User disease detection history
5. `weather_data` - Cached weather information
6. `market_prices` - Market price data by region (with unique constraint: crop_id + market_name)
7. `sync_queue` - Offline action queue
8. `sessions` - Active user sessions
9. `marketplace_listings` - **NEW** Farmer crop listings for direct-to-buyer sales
10. `marketplace_offers` - **NEW** Buyer offers on marketplace listings (optional MVP+)
