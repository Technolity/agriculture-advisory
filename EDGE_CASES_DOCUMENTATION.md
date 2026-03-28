# 🛡️ Edge Cases Documentation

## Edge Case Catalog

### Network Edge Cases

#### Edge Case #1: Complete Offline Mode
- **Scenario**: User has no internet connectivity
- **Handling**: All actions queued in SQLite sync_queue, processed when online
- **Location**: `mobile-app/src/services/syncService.ts`, `mobile-app/src/hooks/useOfflineMode.ts`

#### Edge Case #2: Intermittent Connectivity
- **Scenario**: Connection drops mid-request
- **Handling**: Retry with exponential backoff (1s, 2s, 4s, 8s, 16s max)
- **Location**: `mobile-app/src/services/syncService.ts`

#### Edge Case #3: Request Timeout
- **Scenario**: Server doesn't respond within 30s
- **Handling**: Timeout with fallback to cached data
- **Location**: `mobile-app/src/utils/constants.ts` (API_TIMEOUT)

---

### Image Edge Cases

#### Edge Case #4: Large Image Upload
- **Scenario**: User captures high-resolution photo (>5MB)
- **Handling**: Image compressed to max 500KB before upload
- **Location**: `mobile-app/src/services/diseaseDetectionService.ts`

#### Edge Case #5: Blurry Image
- **Scenario**: User submits blurry/unclear photo
- **Handling**: UI prompt to retake photo, minimum quality threshold check
- **Location**: `mobile-app/src/components/CameraCapture.tsx`

#### Edge Case #6: Duplicate Image Submission
- **Scenario**: User submits same photo twice
- **Handling**: SHA256 hash comparison, return cached result if duplicate
- **Location**: `backend/src/services/diseaseService.ts`

---

### Data Edge Cases

#### Edge Case #7: Sync Conflict
- **Scenario**: Same record modified offline and by another device
- **Handling**: Last-write-wins with user notification
- **Location**: `mobile-app/src/services/syncService.ts`

#### Edge Case #8: Database Full
- **Scenario**: Local SQLite storage exceeds available space
- **Handling**: Warn when <50MB free, purge old cached data
- **Location**: `mobile-app/src/hooks/useLocalStorage.ts`

---

### Device Edge Cases

#### Edge Case #9: Camera Permission Denied
- **Scenario**: User denies camera permission
- **Handling**: Fallback to manual image upload from gallery
- **Location**: `mobile-app/src/hooks/useCamera.ts`

#### Edge Case #10: Low Memory
- **Scenario**: Device has limited RAM
- **Handling**: Reduce image processing quality, disable animations
- **Location**: `mobile-app/src/utils/constants.ts`

---

## Implementation Status

| # | Edge Case | Status | Priority |
|---|-----------|--------|----------|
| 1 | Offline Mode | Scaffolded | P0 |
| 2 | Intermittent Connection | Scaffolded | P0 |
| 3 | Request Timeout | Scaffolded | P1 |
| 4 | Large Image | Scaffolded | P1 |
| 5 | Blurry Image | Placeholder | P2 |
| 6 | Duplicate Image | Scaffolded | P1 |
| 7 | Sync Conflict | Placeholder | P1 |
| 8 | Database Full | Placeholder | P2 |
| 9 | Camera Denied | Scaffolded | P0 |
| 10 | Low Memory | Placeholder | P3 |
