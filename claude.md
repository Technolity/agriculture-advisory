# 🌾 Agricultural Advisory App - Project Context

> **Single source of truth for the entire project.**
> All edits, updates, and changes are logged here.
> Agents must read this file FIRST before making any changes.

---

## Project Overview

| Field | Value |
|-------|-------|
| **Name** | Agricultural Advisory App |
| **Purpose** | Offline-capable mobile app + web app for crop disease detection + agricultural advisory |
| **Target Users** | Smallholder farmers in Kashmir and South Asia |
| **Event** | Cursor Hackathon 2026 |
| **Tech Stack (Web Frontend)** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Redux Toolkit, React Query, Zod |
| **Tech Stack (Mobile)** | React Native + Expo, TypeScript, Redux Toolkit, SQLite |
| **Tech Stack (Backend)** | Node.js + Express, TypeScript, Prisma ORM, PostgreSQL (Supabase) |
| **AI Provider** | OpenAI GPT-4o (vision) for disease detection |
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
├── .mcp.json                    ← Supabase MCP config (gitignored)
├── .gitignore
│
├── backend/                     ← Node.js + Express API
│   ├── package.json             ← includes openai, prisma, express etc.
│   ├── tsconfig.json
│   ├── .env                     ← REAL env file (gitignored) — fully configured
│   ├── .env.example
│   ├── Dockerfile
│   ├── jest.config.ts
│   ├── prisma/
│   │   └── schema.prisma        ← DATABASE SCHEMA (8 tables)
│   ├── src/
│   │   ├── index.ts             ← Express entry point
│   │   ├── config/
│   │   │   ├── database.ts      ← Prisma client
│   │   │   ├── redis.ts         ← Redis client
│   │   │   ├── env.ts           ← Zod-validated env (uses OPENAI_API_KEY)
│   │   │   └── claudeClient.ts  ← OpenAI GPT-4o Vision client (renamed from Claude)
│   │   ├── routes/              ← 7 route files
│   │   ├── controllers/         ← 7 controllers
│   │   ├── services/            ← 6 services
│   │   ├── middleware/          ← 6 middleware files
│   │   ├── utils/               ← logger, imageProcessing, validators, constants
│   │   ├── jobs/                ← weatherSyncJob, priceSyncJob, cleanupJob
│   │   └── types/               ← TypeScript interfaces
│   └── tests/                   ← Test scaffolds
│
├── web-app/                     ← Next.js 15 web frontend (NEW)
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── src/
│       └── app/                 ← Next.js App Router pages (to be built)
│
└── mobile-app/                  ← React Native + Expo (deferred — web first)
    ├── package.json
    ├── app.tsx
    └── src/
        ├── navigation/          ← BottomTabNavigator
        ├── screens/             ← 6 screens
        ├── components/          ← 8 components
        ├── services/            ← 5 services
        ├── hooks/               ← 5 hooks
        ├── store/               ← Redux store + 4 slices
        ├── utils/               ← constants, validators, cropDatabase, diseaseMapping, translations/
        └── types/
```

---

## Database (Supabase — LIVE)

**Provider**: Supabase (cloud PostgreSQL)
**Project ID**: `dfxmprydktoybadlpvxs`
**Project URL**: `https://dfxmprydktoybadlpvxs.supabase.co`
**ORM**: Prisma (client generated)
**Migration**: Applied via Supabase MCP on 2026-03-28

### Tables (8) — All live in Supabase

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

## Backend Environment Variables (`backend/.env`) — CONFIGURED

| Variable | Status | Value/Notes |
|----------|--------|-------------|
| `DATABASE_URL` | ✅ Set | Supabase PostgreSQL (password URL-encoded) |
| `REDIS_URL` | ✅ Set | `redis://localhost:6379` (update for hosted Redis) |
| `JWT_SECRET` | ✅ Set | Custom secret set |
| `JWT_EXPIRES_IN` | ✅ Set | `7d` |
| `OPENAI_API_KEY` | ✅ Set | GPT-4o for disease detection |
| `OPENWEATHERMAP_API_KEY` | ✅ Set | Key configured |
| `PORT` | ✅ Set | `5000` |

---

## AI Provider — OpenAI GPT-4o Vision

> **Note:** The original scaffold used Anthropic Claude. This was switched to OpenAI GPT-4o.

- **File**: `backend/src/config/claudeClient.ts` (filename kept for import compatibility)
- **Model**: `gpt-4o` with vision capability
- **Use case**: Disease detection from base64 crop images
- **Env var**: `OPENAI_API_KEY` (updated in `env.ts` Zod schema)
- **Response format**: `{ disease: string, confidence: number, treatment: string }`

---

## Web App Libraries (`web-app/`) — INSTALLED

| Library | Purpose |
|---------|---------|
| `next` 15, `react`, `react-dom` | Core framework |
| `tailwindcss` | Styling |
| `axios` | API calls to backend |
| `@reduxjs/toolkit`, `react-redux` | State management |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Forms + validation |
| `@tanstack/react-query` | Data fetching/caching |
| `lucide-react` | Icons |
| `js-cookie`, `jwt-decode` | Auth token handling |
| `sonner` | Toast notifications |

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

> Status: ✅ = complete | 🟡 = needs implementation | ❌ = not started

### Backend
- ✅ `prisma/schema.prisma` — **10 tables** (added marketplace_listings, marketplace_offers), all live in Supabase
- ✅ `.env` — Fully configured (Supabase, OpenAI, OpenWeatherMap, Apify token optional, JWT)
- ✅ `src/index.ts` — Express app with all middleware + marketplace routes + background jobs wired
- ✅ `src/config/env.ts` — Includes `OPENAI_API_KEY`, `APIFY_API_TOKEN`, `WEATHER_PROVIDER`
- ✅ `src/config/claudeClient.ts` — OpenAI GPT-4o Vision (filename kept for compatibility)
- ✅ `src/config/apifyClient.ts` — **NEW** Apify client for web scraping (graceful null if no token)
- ✅ `src/config/database.ts`, `redis.ts` — Configured
- ✅ `src/routes/*` — All 7 original route files + **marketplace.routes.ts** (NEW)
- ✅ `src/controllers/*` — All 7 original controllers + **marketplaceController.ts** (NEW)
- ✅ `src/services/authService.ts` — Fixed JWT type error
- ✅ `src/services/syncService.ts` — Fixed Prisma JSON type error
- ✅ `src/services/*` — All 6 services + **marketplaceService.ts** (NEW with 6 functions)
- ✅ `src/middleware/*` — All 6 middleware files
- ✅ `src/utils/*` — logger, imageProcessing, validators, constants
- ✅ `src/jobs/weatherSyncJob.ts` — **IMPLEMENTED** (fetches user locations, calls getWeather() every 1h)
- ✅ `src/jobs/priceSyncJob.ts` — **IMPLEMENTED** (ready for Apify actor call every 6h)
- ✅ `src/jobs/cleanupJob.ts` — Scaffolded
- ✅ `src/types/index.ts` — Complete type definitions + marketplace types
- ✅ `src/services/diseaseService.ts` — **FIXED** AI result matching to diseases table
- ✅ `src/services/weatherService.ts` — **IMPLEMENTED** OpenWeatherMap API call + Apify toggle
- ✅ `src/services/priceService.ts` — **FIXED** upsert to use composite unique key

### Web App (Next.js)
- ✅ Scaffolded with `create-next-app` (App Router, TypeScript, Tailwind)
- ✅ All libraries installed
- 🟡 Pages/screens — Being built by frontend developer (separate branch)

### Mobile (deferred — web first)
- ✅ All files scaffolded (87+ files)
- 🟡 Implementation pending

---

## Change Log

| Date | Change | Files Affected | Status |
|------|--------|---|--------|
| 2026-03-28 | Initial scaffold — complete project foundation | All 87+ files | ✅ |
| 2026-03-28 | Backend `npm install` — 547 packages installed | `backend/node_modules` | ✅ |
| 2026-03-28 | Switched AI provider: Anthropic → OpenAI GPT-4o | `claudeClient.ts`, `env.ts`, `.env`, `package.json` | ✅ |
| 2026-03-28 | Database migrated to Supabase — all 8 tables live | Supabase project `dfxmprydktoybadlpvxs` | ✅ |
| 2026-03-28 | Prisma client generated | `node_modules/@prisma/client` | ✅ |
| 2026-03-28 | All `.env` variables configured | `backend/.env` | ✅ |
| 2026-03-28 | Fixed TypeScript errors (JWT + Prisma JSON types) | `authService.ts`, `syncService.ts` | ✅ |
| 2026-03-28 | Next.js web app scaffolded + libraries installed | `web-app/` | ✅ |
| 2026-03-28 | Supabase MCP configured | `.mcp.json`, `.claude/settings.local.json` | ✅ |
| **2026-03-28** | **PHASE 0: Critical backend bug fixes** | priceService, weatherService, diseaseService, weatherSyncJob, priceSyncJob | **✅ COMPLETE** |
| **2026-03-28** | **PHASE 1: Apify integration scaffold** | apifyClient.ts (NEW), env.ts, weatherService.ts, priceSyncJob.ts | **✅ READY** |
| **2026-03-28** | **PHASE 2: Marketplace backend (direct farmer↔buyer)** | schema.prisma (+2 models), 4 new files (service, controller, routes, types) | **✅ COMPLETE** |
| 2026-03-28 | Backend `npm install apify-client` — 614 packages total | `backend/package.json` | ✅ |
| 2026-03-28 | Database schema extended to 10 tables + Supabase migrated | `marketplace_listings`, `marketplace_offers` tables live | ✅ |
| 2026-03-28 | TypeScript compilation verified — zero errors | Backend ready to run | ✅ |
| 2026-03-28 | Backend server tested — starts on port 5000, jobs initialize | Express + jobs startup verified | ✅ |

---

## Current Status (2026-03-28)

✅ **Backend**: Phase 0, 1, 2 complete. Server tested and working. Ready for frontend integration.
🟡 **Frontend**: Being built separately by frontend developer. Use Mobbin.com for UI/UX design patterns.
❌ **Mobile**: Deferred until web app is functional.

## Next Steps

1. **Frontend & Backend Integration**:
   - Frontend dev completes pages (Dashboard, Detect, Marketplace, Weather, Prices, Auth)
   - Merge frontend branch into main
   - **IMPORTANT**: Backend changes are git-committed, so pulling frontend won't overwrite backend work

2. **Start backend server** (for testing):
   ```bash
   cd backend && npm run dev
   # Runs on http://localhost:5000
   ```

3. **Test endpoints** (once frontend is ready):
   - Auth: POST `/api/auth/register`, POST `/api/auth/login`
   - Disease: POST `/api/diseases/detect`
   - Marketplace: GET, POST `/api/marketplace/listings`
   - Weather: GET `/api/weather?latitude=X&longitude=Y`
   - Prices: GET `/api/prices?region=Kashmir`

4. **Apify Integration** (during hackathon):
   - Get Apify API token from hackathon sponsor
   - Add `APIFY_API_TOKEN=...` to `backend/.env`
   - Uncomment 3 lines in `src/jobs/priceSyncJob.ts` for actor call
   - Apify scrapes commodity prices → maps to DB crops

5. **Mobile app**: Start after web app is fully functional

---

## Team Distribution

| Team Member | Focus Area | Priority Files |
|-------------|-----------|---------------|
| **Frontend Dev** | Next.js web screens | `web-app/src/app/*` pages, components |
| **Backend Dev** | Controllers + Services | `src/controllers/*`, `src/services/*` |
| **Presenter/DevOps** | Docs + Deployment | `README.md`, `Dockerfile`, GitHub Actions |

---

## 🔐 Git Workflow: Protecting Backend & Frontend Changes

**Important**: When pulling frontend changes into main, backend work is protected because all backend code is committed to git.

### Safe Merge Strategy

**Frontend dev's branch** (`develop` or similar):
```bash
# Frontend dev works on: web-app/src/app/*, web-app/src/lib/*, web-app/src/components/*
# ONLY modifies web-app/ directory (except package.json dependencies)
```

**Backend (main branch)**:
```bash
# Committed changes:
# - backend/prisma/schema.prisma (+marketplace models)
# - backend/src/**/* (all services, controllers, routes, jobs)
# - backend/package.json (apify-client added)
# These are safe in git and won't be overwritten
```

### Pulling Frontend Changes Without Losing Backend Work

```bash
# 1. Make sure backend changes are committed (they are)
git status  # Should be clean or show only untracked files

# 2. Fetch and merge frontend branch
git fetch origin develop  # Or wherever frontend dev pushes
git merge origin/develop

# 3. If merge conflicts in web-app/ files:
git diff --name-only --diff-filter=U  # Show conflicts
# Resolve in: web-app/package.json (add new deps), web-app/src/app/*, etc.
# Backend files won't conflict because frontend only touches web-app/

# 4. Continue merge
git add <resolved-files>
git commit -m "Merge frontend changes"
```

### File Ownership (No Conflicts)

| Path | Owner | Conflict Risk |
|------|-------|---|
| `backend/**` | Backend Dev | ❌ None (only backend touches) |
| `web-app/**` | Frontend Dev | ❌ Low (only frontend touches) |
| `mobile-app/**` | Mobile Dev (later) | ❌ None (deferred) |
| `package.json` (root) | Both | ⚠️ Unlikely (dependency mgmt separate) |
| `README.md`, `claude.md`, docs | Docs | ⚠️ Update together |

**TL;DR**: Backend changes are committed to git. Pulling frontend branch won't delete backend work. Both teams can work in parallel with minimal conflicts.
