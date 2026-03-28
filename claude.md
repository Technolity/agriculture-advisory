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
- ✅ `prisma/schema.prisma` — 8 tables, all live in Supabase
- ✅ `.env` — Fully configured (Supabase, OpenAI, OpenWeatherMap, JWT)
- ✅ `src/index.ts` — Express app with all middleware wired
- ✅ `src/config/env.ts` — Uses `OPENAI_API_KEY`
- ✅ `src/config/claudeClient.ts` — OpenAI GPT-4o Vision (filename kept for compatibility)
- ✅ `src/config/database.ts`, `redis.ts` — Configured
- ✅ `src/routes/*` — All 7 route files
- ✅ `src/controllers/*` — All 7 controllers
- ✅ `src/services/authService.ts` — Fixed JWT type error
- ✅ `src/services/syncService.ts` — Fixed Prisma JSON type error
- ✅ `src/services/*` — All 6 services
- ✅ `src/middleware/*` — All 6 middleware files
- ✅ `src/utils/*` — logger, imageProcessing, validators, constants
- ✅ `src/jobs/*` — 3 job files (placeholder logic)
- ✅ `src/types/index.ts` — Complete type definitions

### Web App (Next.js)
- ✅ Scaffolded with `create-next-app` (App Router, TypeScript, Tailwind)
- ✅ All libraries installed
- 🟡 Pages/screens — not yet built (next priority)

### Mobile (deferred — web first)
- ✅ All files scaffolded (87+ files)
- 🟡 Implementation pending

---

## Change Log

| Date | Change | Files Affected |
|------|--------|---------------|
| 2026-03-28 | Initial scaffold — complete project foundation | All 87+ files |
| 2026-03-28 | Backend `npm install` — 547 packages installed | `backend/node_modules` |
| 2026-03-28 | Switched AI provider: Anthropic → OpenAI GPT-4o | `claudeClient.ts`, `env.ts`, `.env`, `package.json` |
| 2026-03-28 | Database migrated to Supabase — all 8 tables live | Supabase project `dfxmprydktoybadlpvxs` |
| 2026-03-28 | Prisma client generated | `node_modules/@prisma/client` |
| 2026-03-28 | All `.env` variables configured | `backend/.env` |
| 2026-03-28 | Fixed TypeScript errors (JWT + Prisma JSON types) | `authService.ts`, `syncService.ts` |
| 2026-03-28 | Next.js web app scaffolded + libraries installed | `web-app/` |
| 2026-03-28 | Supabase MCP configured | `.mcp.json`, `.claude/settings.local.json` |

---

## Next Steps

1. **Start backend**: `cd backend && npm run dev` → runs on `http://localhost:5000`
2. **Test health**: `curl http://localhost:5000/api/v1/health`
3. **Build web app pages**: Dashboard, Disease Detection, Market Prices, Auth screens
4. **Mobile app**: Start after web app is functional

---

## Team Distribution

| Team Member | Focus Area | Priority Files |
|-------------|-----------|---------------|
| **Frontend Dev** | Next.js web screens | `web-app/src/app/*` pages, components |
| **Backend Dev** | Controllers + Services | `src/controllers/*`, `src/services/*` |
| **Presenter/DevOps** | Docs + Deployment | `README.md`, `Dockerfile`, GitHub Actions |
