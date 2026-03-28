# Frontend — KisanAI Web App

> Complete reference for the Next.js frontend. Everything you need to build, run, and extend the web app.

---

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.1 | Framework (App Router) |
| React | 19.2.4 | UI |
| TypeScript | Latest | Type safety |
| Tailwind CSS | v4 | Styling |
| Axios | 1.14.0 | HTTP calls to backend |
| @tanstack/react-query | 5.95.2 | Data fetching + caching |
| @reduxjs/toolkit + react-redux | 2.11.2 | Global state |
| react-hook-form + zod | 7.72.0 / 4.3.6 | Forms + validation |
| lucide-react | 1.7.0 | Icons |
| sonner | 2.0.7 | Toast notifications |
| js-cookie + jwt-decode | 3.0.5 / 4.0.0 | JWT auth |

---

## Running the App

```bash
cd web-app
npm install
npm run dev       # http://localhost:3000
npm run build     # production build check
```

Backend must be running at `http://localhost:5000` for API calls to work.

---

## Folder Structure

```
web-app/
├── app/                        ← Next.js App Router (file = route)
│   ├── globals.css             ← Tailwind v4 + CSS design tokens + Inter font
│   ├── layout.tsx              ← Root layout: Providers + Navbar + OfflineBanner
│   ├── page.tsx                ← / — Home Dashboard
│   ├── login/page.tsx          ← /login
│   ├── register/page.tsx       ← /register
│   ├── detect/page.tsx         ← /detect — Disease Detection
│   ├── guide/page.tsx          ← /guide — Planting Guide
│   ├── prices/page.tsx         ← /prices — Market Prices
│   └── settings/page.tsx       ← /settings
│
├── components/
│   ├── Navbar.tsx              ← Desktop sidebar (green, 240px) + mobile bottom tab bar
│   ├── WeatherWidget.tsx       ← Blue gradient weather card with 5-day forecast
│   ├── DiseaseResult.tsx       ← AI detection result card
│   ├── CropCard.tsx            ← 170px crop info card for grid
│   ├── LanguageSelector.tsx    ← 3-pill language toggle (EN / UR / PA)
│   ├── SyncProgress.tsx        ← Amber offline sync progress bar
│   ├── OfflineBanner.tsx       ← Red strip shown when browser is offline
│   ├── LoadingSkeleton.tsx     ← Pulsing grey placeholder rows
│   └── Providers.tsx           ← QueryClientProvider + Toaster wrapper
│
├── lib/
│   ├── axios.ts                ← Axios instance: baseURL + JWT interceptor
│   └── queryClient.ts          ← React Query client (5 min stale time)
│
├── hooks/
│   ├── useAuth.ts              ← Read JWT from cookie, decode user info
│   └── useOffline.ts           ← Detect browser online/offline state
│
└── types/
    └── index.ts                ← TypeScript interfaces: User, Crop, Disease, DetectionResult, WeatherData, MarketPrice
```

---

## Design System

All colors are CSS variables defined in `globals.css`. Use them via `style={{ color: 'var(--color-primary)' }}` or reference below.

### Colors

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-primary` | `#2D6A2F` | Primary green — buttons, sidebar, active states |
| `--color-primary-light` | `#4CAF50` | Lighter green — hover, upload borders |
| `--color-primary-pale` | `#E8F5E9` | Very light green — badge backgrounds, card fills |
| `--color-accent` | `#F59E0B` | Amber — sync progress, warnings |
| `--color-accent-light` | `#FEF3C7` | Light amber — SyncProgress card bg |
| `--color-danger` | `#DC2626` | Red — errors, disease alerts |
| `--color-danger-light` | `#FEE2E2` | Light red — error backgrounds |
| `--color-neutral-100` | `#F3F4F6` | Page background, input fields |
| `--color-neutral-200` | `#E5E7EB` | Dividers, inactive borders |
| `--color-neutral-500` | `#6B7280` | Secondary text, placeholders |
| `--color-neutral-700` | `#374151` | Body text |
| `--color-neutral-900` | `#111827` | Headings, primary text |
| `--color-white` | `#FFFFFF` | Card backgrounds |

### WeatherWidget — Special gradient
```
background: linear-gradient(180deg, #1E88E5 0%, #0D47A1 100%)
```
This widget is blue (not green) — it uses hardcoded hex values, not CSS variables.

### Typography
- Font: **Inter** (Google Fonts, loaded in `globals.css`)
- Icons: **lucide-react** — import individually e.g. `import { Sprout } from 'lucide-react'`

### Tailwind v4 Note
Uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`). No `tailwind.config.js` needed. All classes work the same way in JSX.

---

## Auth Flow

No Supabase Auth — uses JWT from the Express backend.

```
1. POST /api/auth/login  → { token: "eyJ..." }
2. Cookies.set('token', token, { expires: 7 })
3. Every API call: Authorization: Bearer <token>  ← handled by axios interceptor
4. Read user: jwtDecode(token) → { id, name, email, phone, region, language }
5. Logout: Cookies.remove('token') → router.push('/login')
```

**`useAuth` hook** (`hooks/useAuth.ts`):
```ts
const { user, token, isAuthenticated } = useAuth()
// user: { id, name, email, phone, region, language } | null
```

**Protecting a page:**
```tsx
useEffect(() => {
  if (!isAuthenticated) router.push('/login')
}, [isAuthenticated, router])
```

---

## API Integration

Backend base URL: `http://localhost:5000`
All calls go through the configured Axios instance at `lib/axios.ts` — it automatically attaches the JWT token.

```ts
import api from '@/lib/axios'

// GET
const { data } = await api.get('/api/crops?region=kashmir')

// POST with JSON
const { data } = await api.post('/api/auth/login', { email, password })

// POST with file
const formData = new FormData()
formData.append('image', file)
const { data } = await api.post('/api/diseases/detect', formData)
```

### All Backend Endpoints

| Method | Path | Auth | Used in |
|--------|------|------|---------|
| POST | `/api/auth/register` | No | `/register` |
| POST | `/api/auth/login` | No | `/login` |
| GET | `/api/crops` | No | `/guide` |
| GET | `/api/crops/:id/diseases` | No | `/detect` |
| POST | `/api/diseases/detect` | Yes | `/detect` |
| GET | `/api/weather` | No | `/` (Home) |
| GET | `/api/prices` | No | `/prices` |
| POST | `/api/sync/queue` | Yes | SyncProgress |
| GET | `/api/marketplace/listings` | No | Marketplace (TODO) |
| POST | `/api/marketplace/listings` | Yes | Marketplace (TODO) |
| GET | `/api/marketplace/listings/:id` | No | Marketplace (TODO) |
| PUT | `/api/marketplace/listings/:id` | Yes | Marketplace (TODO) |
| DELETE | `/api/marketplace/listings/:id` | Yes | Marketplace (TODO) |
| POST | `/api/marketplace/listings/:id/contact` | Yes | Marketplace (TODO) |
| GET | `/health` | No | Debug |

---

## Data Fetching Pattern (React Query)

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

const { data, isLoading, error } = useQuery({
  queryKey: ['prices', region],        // cache key — change = refetch
  queryFn: () => api.get(`/api/prices?region=${region}`).then(r => r.data),
})

if (isLoading) return <LoadingSkeleton />
if (error) return <p>Failed to load</p>
```

---

## Form Pattern (React Hook Form + Zod)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().min(10),
  password: z.string().min(8),
})
type FormData = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
  resolver: zodResolver(schema),
})

const onSubmit = async (data: FormData) => {
  const res = await api.post('/api/auth/login', data)
  Cookies.set('token', res.data.data.token, { expires: 7 })
}
```

---

## Toast Notifications

```tsx
import { toast } from 'sonner'

toast.success('Detection saved!')
toast.error('Upload failed. Try again.')
```

`<Toaster />` is already mounted in `Providers.tsx` — no extra setup needed.

---

## Pages

### `/login` — Login
- Green hero section with KisanAI brand
- Phone + password form with Zod validation
- On submit: `POST /api/auth/login` → save JWT → redirect `/`
- Language selector (EN/UR/PA) at bottom

### `/register` — Register
- Green rounded header
- Full Name, Phone, Password (with strength bar), Farm Name, Region dropdown
- On submit: `POST /api/auth/register` → save JWT → redirect `/`

### `/` — Home Dashboard (protected)
- Greeting row: "Good Morning, {name}" + bell + avatar
- WeatherWidget (fetches `/api/weather?latitude=34.08&longitude=74.79`)
- 4 Quick Action cards: Disease Detection, Weather, Crop Guide, Prices
- Tip of the Day card (green bg)
- Recent Detections list

### `/detect` — Disease Detection (protected)
- Drag & drop / file input / camera upload
- Image preview with remove button
- "Analyze Disease" → `POST /api/diseases/detect` (FormData)
- Shows `DiseaseResult` component with disease name, confidence, severity, symptoms, treatment steps, feedback buttons

### `/guide` — Planting Guide
- Season filter pills (All / Rabi / Kharif / Zaid)
- `GET /api/crops?season=X` → 2-col grid of `CropCard` components
- Tap card → slide-up drawer with full crop details

### `/prices` — Market Prices
- Region tabs (Kashmir / Punjab / Sindh / KPK)
- `GET /api/prices?region=X` → horizontal summary cards + full price list
- TrendingUp/Down arrows for price change indicators

### `/settings` — Settings (protected)
- Profile section (avatar initials, name, phone, region)
- Language selector
- Notification toggle (push + disease alerts)
- Sign Out button → `logout()` + redirect `/login`

---

## Components

### `Navbar`
- **Desktop**: Fixed left sidebar 240px, green bg, KisanAI brand, 5 nav links
- **Mobile**: Fixed bottom tab bar, 5 tabs with icon + label
- Auto-hides on `/login` and `/register`
- Active link highlighted with `rgba(255,255,255,0.2)` bg

### `WeatherWidget`
Props: `temperature`, `condition`, `humidity`, `windSpeed`, `rainRisk`, `location`, `forecast[]`
Blue gradient card. 5-day forecast row at bottom. All defaults pre-filled.

### `DiseaseResult`
Props: `disease`, `confidence`, `severity`, `symptoms[]`, `treatmentSteps[]`, `onFeedback`
Shows disease name (red), confidence pill (green), severity badge, symptom bullets, numbered treatment steps, thumbs feedback row.

### `CropCard`
Props: `crop: Crop`, `onClick`
170px wide card — sprout icon placeholder, crop name + Urdu name, season badge, 3 stat rows (sow/harvest/water), "View Guide" outlined button.

### `LanguageSelector`
Props: `selected: 'en' | 'ur' | 'pa'`, `onChange`
3 pill toggle. Active = green filled. Inactive = white with border.

### `SyncProgress`
Props: `itemCount`, `progress`, `onCancel`
Amber card. Spinning refresh icon. Progress bar (percentage). Cancel button.

### `OfflineBanner`
No props. Auto-detects offline via `useOffline` hook. Shows red strip with wifi-off icon. Hidden when online.

### `LoadingSkeleton`
Props: `rows?: number` (default 3)
Pulsing grey placeholder rows. Use while `isLoading` from React Query.

---

## Environment Variables

Create `web-app/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If not set, defaults to `http://localhost:5000` (set in `lib/axios.ts`).

---

## Pending / TODO

| Feature | Page | API Endpoint |
|---------|------|-------------|
| Marketplace listings browse | New `/marketplace` page | `GET /api/marketplace/listings` |
| Create listing (seller) | `/marketplace/new` | `POST /api/marketplace/listings` |
| View listing + contact seller | `/marketplace/:id` | `GET + POST /api/marketplace/listings/:id/contact` |
| Offline sync queue | `SyncProgress` component | `POST /api/sync/queue` |
| Redux store setup | Global state | `store/userSlice.ts`, `store/appSlice.ts` |
| Language switching (i18n) | All pages | Local only |

---

## Git Branch

This frontend lives on: **`feature/frontend-ui`**

To merge into main when ready:
```bash
git checkout main
git merge feature/frontend-ui
```
