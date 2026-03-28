# 🌾 Agricultural Advisory App - Project Context

> **Single source of truth for the entire project.**
> All edits, updates, and changes are logged here.
> Agents must read this file FIRST before making any changes.

---

## Project Overview

| Field | Value |
|-------|-------|
| **Name** | Agricultural Advisory App |
| **Purpose** | Offline-capable mobile app for crop disease detection + agricultural advisory |
| **Target Users** | Smallholder farmers in Kashmir and South Asia |
| **Event** | Cursor Hackathon 2026 |
| **Tech Stack (Frontend)** | React Native + Expo, TypeScript, Redux Toolkit, SQLite |
| **Tech Stack (Backend)** | Node.js + Express, TypeScript, Prisma ORM, PostgreSQL |
| **Languages** | English, Urdu, Punjabi |
| **Team Size** | 3 (Frontend Dev, Backend Dev, Presenter/DevOps) |

---

## Project Structure

```
d:\Agriculture Advisory\
├── claude.md                    ← THIS FILE (context)
├── README.md                    ← Quick start guide
├── ARCHITECTURE.md              ← System architecture
├── API_DOCUMENTATION.md         ← API endpoint docs
├── EDGE_CASES_DOCUMENTATION.md  ← Edge case catalog
├── FILES_MANIFEST.md            ← Complete file inventory
├── .gitignore
│
├── backend/                     ← Node.js + Express API
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── Dockerfile
│   ├── jest.config.ts
│   ├── prisma/
│   │   └── schema.prisma        ← DATABASE SCHEMA (8 tables)
│   ├── src/
│   │   ├── index.ts             ← Express entry point
│   │   ├── config/              ← database, redis, env, claudeClient
│   │   ├── routes/              ← 7 route files
│   │   ├── controllers/         ← 7 controllers
│   │   ├── services/            ← 6 services
│   │   ├── middleware/          ← 6 middleware files
│   │   ├── utils/               ← logger, imageProcessing, validators, constants
│   │   ├── jobs/                ← weatherSyncJob, priceSyncJob, cleanupJob
│   │   └── types/               ← TypeScript interfaces
│   └── tests/                   ← Test scaffolds
│
├── mobile-app/                  ← React Native + Expo
│   ├── package.json
│   ├── tsconfig.json
│   ├── app.json
│   ├── app.tsx                  ← App entry point
│   ├── .env.example
│   ├── babel.config.js
│   ├── src/
│   │   ├── navigation/          ← BottomTabNavigator
│   │   ├── screens/             ← 6 screens
│   │   ├── components/          ← 8 components
│   │   ├── services/            ← 5 services
│   │   ├── hooks/               ← 5 hooks
│   │   ├── store/               ← Redux store + 4 slices
│   │   ├── utils/               ← constants, validators, cropDatabase, diseaseMapping, translations/
│   │   ├── types/               ← TypeScript interfaces
│   │   └── assets/              ← models, images, offline-data
│   └── tests/                   ← Test scaffolds
```

---

## Database Schema

**ORM**: Prisma  
**Database**: PostgreSQL  
**Schema File**: `backend/prisma/schema.prisma`

### Tables (8)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | email, phone, name, language, region, lat/lng, device_id |
| `crops` | Crop reference data | name, name_urdu, region, season, planting_month, harvest_month |
| `diseases` | Disease reference data | crop_id, name, symptoms, treatment, severity_level, tflite_class_id |
| `disease_detections` | Detection history | user_id, crop_id, disease_id, image_hash, confidence, user_feedback |
| `weather_data` | Cached weather | lat/lng, temperature, humidity, rainfall, condition |
| `market_prices` | Market prices | crop_id, market_name, market_region, price_per_unit |
| `sync_queue` | Offline sync queue | user_id, action_type, payload, priority, retry_count |
| `sessions` | Auth sessions | user_id, token, expires_at, device_id |

### Indices
- `idx_disease_crop` - diseases by crop
- `idx_detection_user` - detections by user
- `idx_detection_image_hash` - image dedup
- `idx_weather_location` - weather by coords
- `idx_price_crop` / `idx_price_region` - prices lookup
- `idx_sync_queue_user` / `idx_sync_queue_priority` - sync queue processing
- `idx_session_user` / `idx_session_token` - session lookup

---

## API Routes

| Method | Path | Auth | Controller | Status |
|--------|------|------|-----------|--------|
| POST | `/api/auth/register` | No | authController | ✅ Scaffolded |
| POST | `/api/auth/login` | No | authController | ✅ Scaffolded |
| GET | `/api/crops` | Optional | cropController | ✅ Scaffolded |
| GET | `/api/crops/:id/diseases` | Optional | cropController | ✅ Scaffolded |
| POST | `/api/diseases/detect` | Required | diseaseController | ✅ Scaffolded |
| GET | `/api/weather` | Optional | weatherController | ✅ Scaffolded |
| GET | `/api/prices` | Optional | priceController | ✅ Scaffolded |
| POST | `/api/sync/queue` | Required | syncController | ✅ Scaffolded |
| GET | `/health` | No | healthController | ✅ Scaffolded |

---

## Redux Store (Mobile)

| Slice | Purpose | Key State |
|-------|---------|-----------|
| `app` | Global app state | networkStatus, syncStatus, language, pendingSyncCount |
| `crops` | Crop data | crops[], selectedCrop, diseases[], isLoading |
| `disease` | Disease detection | detections[], currentDetection, currentImage, isProcessing |
| `user` | Auth & profile | user, token, isAuthenticated |

---

## Edge Cases Tracked

| # | Edge Case | Status |
|---|-----------|--------|
| 1 | Offline Mode | ✅ Scaffolded |
| 2 | Retry with Exponential Backoff | ✅ Scaffolded |
| 3 | API Timeout (30s) | ✅ Scaffolded |
| 4 | Large Image (>500KB) | ✅ Scaffolded |
| 5 | Blurry Image | 🟡 Placeholder |
| 6 | Duplicate Image (SHA256) | ✅ Scaffolded |
| 7 | Sync Conflict | 🟡 Placeholder |
| 8 | Low Storage (<50MB) | 🟡 Placeholder |
| 9 | Camera Permission Denied | ✅ Scaffolded |
| 10 | Low Memory | 🟡 Placeholder |

---

## Finalized Files

> All files listed below are **scaffolded and ready** for team development.
> Status: ✅ = complete scaffold | 🟡 = needs implementation | ❌ = not started

### Backend
- ✅ `prisma/schema.prisma` — Complete with 8 tables and indices
- ✅ `src/index.ts` — Express app with all middleware wired
- ✅ `src/config/*` — database, redis, env, claudeClient
- ✅ `src/routes/*` — All 7 route files
- ✅ `src/controllers/*` — All 7 controllers
- ✅ `src/services/*` — All 6 services (authService has real logic)
- ✅ `src/middleware/*` — All 6 middleware files
- ✅ `src/utils/*` — logger, imageProcessing, validators, constants
- ✅ `src/jobs/*` — 3 job files (placeholder)
- ✅ `src/types/index.ts` — Complete type definitions

### Mobile
- ✅ `app.tsx` — App entry with Redux, Navigation, ErrorBoundary
- ✅ `src/navigation/BottomTabNavigator.tsx` — 5 tabs
- ✅ `src/screens/*` — All 6 screens
- ✅ `src/components/*` — All 8 components
- ✅ `src/services/*` — All 5 services
- ✅ `src/hooks/*` — All 5 hooks
- ✅ `src/store/*` — Redux store + 4 slices
- ✅ `src/utils/*` — constants, validators, cropDatabase, diseaseMapping
- ✅ `src/utils/translations/*` — en, ur, pb JSON files
- ✅ `src/types/index.ts` — Complete type definitions

---

## Change Log

| Date | Change | Files Affected |
|------|--------|---------------|
| 2026-03-28 | Initial scaffold - Complete project foundation | All 87+ files |

---

## Next Steps

1. **Run `npm install`** in both `/backend` and `/mobile-app`
2. **Set up PostgreSQL** and update `.env` with connection string
3. **Run `npx prisma generate`** to create Prisma client
4. **Start backend**: `cd backend && npm run dev`
5. **Start mobile**: `cd mobile-app && npx expo start`
6. **Begin implementation**: Fill in service logic, screen UI, controller implementations

---

## Team Distribution

| Team Member | Focus Area | Priority Files |
|-------------|-----------|---------------|
| **Frontend Dev** | Screens + Components | `src/screens/*`, `src/components/*`, `src/services/*` |
| **Backend Dev** | Controllers + Services | `src/controllers/*`, `src/services/*`, `prisma/schema.prisma` |
| **Presenter/DevOps** | Docs + Deployment | `README.md`, `Dockerfile`, GitHub Actions, Demo prep |
