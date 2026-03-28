# 📁 Files Manifest

> Auto-generated file inventory to prevent duplicates.
> Last updated: 2026-03-28

## Root Files (9)
| File | Purpose |
|------|---------|
| `.gitignore` | Git ignore rules |
| `README.md` | Quick start guide |
| `ARCHITECTURE.md` | System architecture |
| `API_DOCUMENTATION.md` | API endpoint docs |
| `EDGE_CASES_DOCUMENTATION.md` | Edge case catalog |
| `FILES_MANIFEST.md` | This file |
| `CLAUDE_CODE_PROMPT.md` | Original prompt |
| `claude.md` | Project context file |

## Backend Files (39)
| Path | Purpose |
|------|---------|
| `backend/package.json` | Dependencies |
| `backend/tsconfig.json` | TypeScript config |
| `backend/.env.example` | Environment template |
| `backend/Dockerfile` | Docker build |
| `backend/jest.config.ts` | Test config |
| `backend/prisma/schema.prisma` | Database schema (8 tables) |
| `backend/src/index.ts` | Express entry point |
| `backend/src/config/database.ts` | Prisma client |
| `backend/src/config/redis.ts` | Redis client |
| `backend/src/config/env.ts` | Env validation |
| `backend/src/config/claudeClient.ts` | Claude API client |
| `backend/src/routes/auth.routes.ts` | Auth routes |
| `backend/src/routes/crops.routes.ts` | Crop routes |
| `backend/src/routes/disease.routes.ts` | Disease routes |
| `backend/src/routes/weather.routes.ts` | Weather routes |
| `backend/src/routes/prices.routes.ts` | Price routes |
| `backend/src/routes/sync.routes.ts` | Sync routes |
| `backend/src/routes/health.routes.ts` | Health route |
| `backend/src/controllers/authController.ts` | Auth controller |
| `backend/src/controllers/cropController.ts` | Crop controller |
| `backend/src/controllers/diseaseController.ts` | Disease controller |
| `backend/src/controllers/weatherController.ts` | Weather controller |
| `backend/src/controllers/priceController.ts` | Price controller |
| `backend/src/controllers/syncController.ts` | Sync controller |
| `backend/src/controllers/healthController.ts` | Health controller |
| `backend/src/services/authService.ts` | Auth service |
| `backend/src/services/diseaseService.ts` | Disease service |
| `backend/src/services/cropService.ts` | Crop service |
| `backend/src/services/weatherService.ts` | Weather service |
| `backend/src/services/priceService.ts` | Price service |
| `backend/src/services/syncService.ts` | Sync service |
| `backend/src/middleware/auth.ts` | JWT auth middleware |
| `backend/src/middleware/errorHandler.ts` | Error handling |
| `backend/src/middleware/validator.ts` | Zod validation |
| `backend/src/middleware/rateLimit.ts` | Rate limiting |
| `backend/src/middleware/cors.ts` | CORS config |
| `backend/src/middleware/logging.ts` | Request logging |
| `backend/src/utils/logger.ts` | Pino logger |
| `backend/src/utils/imageProcessing.ts` | Image utils |
| `backend/src/utils/validators.ts` | Zod schemas |
| `backend/src/utils/constants.ts` | Constants |
| `backend/src/jobs/weatherSyncJob.ts` | Weather job |
| `backend/src/jobs/priceSyncJob.ts` | Price job |
| `backend/src/jobs/cleanupJob.ts` | Cleanup job |
| `backend/src/types/index.ts` | TypeScript types |
| `backend/tests/routes.test.ts` | Route tests |
| `backend/tests/services.test.ts` | Service tests |

## Mobile App Files (39)
| Path | Purpose |
|------|---------|
| `mobile-app/package.json` | Dependencies |
| `mobile-app/tsconfig.json` | TypeScript config |
| `mobile-app/app.json` | Expo config |
| `mobile-app/app.tsx` | App entry |
| `mobile-app/.env.example` | Environment template |
| `mobile-app/babel.config.js` | Babel config |
| `mobile-app/src/navigation/BottomTabNavigator.tsx` | Tab navigation |
| `mobile-app/src/screens/HomeScreen.tsx` | Home screen |
| `mobile-app/src/screens/DiseaseDetectionScreen.tsx` | Detection screen |
| `mobile-app/src/screens/PlantingGuideScreen.tsx` | Planting screen |
| `mobile-app/src/screens/MarketPriceScreen.tsx` | Prices screen |
| `mobile-app/src/screens/OfflineMapScreen.tsx` | Map screen |
| `mobile-app/src/screens/SettingsScreen.tsx` | Settings screen |
| `mobile-app/src/components/CameraCapture.tsx` | Camera component |
| `mobile-app/src/components/DiseaseResult.tsx` | Result display |
| `mobile-app/src/components/CropCard.tsx` | Crop card |
| `mobile-app/src/components/OfflineIndicator.tsx` | Offline banner |
| `mobile-app/src/components/SyncProgress.tsx` | Sync status |
| `mobile-app/src/components/ErrorBoundary.tsx` | Error boundary |
| `mobile-app/src/components/LanguageSelector.tsx` | Language picker |
| `mobile-app/src/components/WeatherWidget.tsx` | Weather display |
| `mobile-app/src/services/diseaseDetectionService.ts` | Disease API |
| `mobile-app/src/services/weatherService.ts` | Weather API |
| `mobile-app/src/services/marketPriceService.ts` | Price API |
| `mobile-app/src/services/offlineStorageService.ts` | Local storage |
| `mobile-app/src/services/syncService.ts` | Sync queue |
| `mobile-app/src/hooks/useLocalStorage.ts` | Storage hook |
| `mobile-app/src/hooks/useOfflineMode.ts` | Offline hook |
| `mobile-app/src/hooks/useWeather.ts` | Weather hook |
| `mobile-app/src/hooks/useCamera.ts` | Camera hook |
| `mobile-app/src/hooks/useSync.ts` | Sync hook |
| `mobile-app/src/store/store.ts` | Redux store |
| `mobile-app/src/store/appSlice.ts` | App state |
| `mobile-app/src/store/cropsSlice.ts` | Crops state |
| `mobile-app/src/store/diseaseSlice.ts` | Disease state |
| `mobile-app/src/store/userSlice.ts` | User state |
| `mobile-app/src/utils/constants.ts` | Constants |
| `mobile-app/src/utils/validators.ts` | Validators |
| `mobile-app/src/utils/cropDatabase.ts` | Local crop data |
| `mobile-app/src/utils/diseaseMapping.ts` | Disease mapping |
| `mobile-app/src/utils/translations/en.json` | English |
| `mobile-app/src/utils/translations/ur.json` | Urdu |
| `mobile-app/src/utils/translations/pb.json` | Punjabi |
| `mobile-app/src/types/index.ts` | TypeScript types |
| `mobile-app/src/assets/models/.gitkeep` | ML models dir |
| `mobile-app/src/assets/images/.gitkeep` | Images dir |
| `mobile-app/src/assets/offline-data/.gitkeep` | Offline data dir |
| `mobile-app/tests/app.test.ts` | App tests |

## Total: ~87 files
