/**
 * Application Constants
 * Centralized configuration values
 * @module utils/constants
 */

/** API version prefix */
export const API_PREFIX = '/api';

/** Default pagination values */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/** Authentication */
export const BCRYPT_SALT_ROUNDS = 12;
export const TOKEN_PREFIX = 'Bearer';

/** Image processing */
export const MAX_IMAGE_SIZE_KB = 500;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** API timeouts (ms) */
export const API_TIMEOUT = 30000;
export const CLAUDE_API_TIMEOUT = 60000;
export const WEATHER_API_TIMEOUT = 15000;

/** Retry configuration - Edge case #2 */
export const RETRY_CONFIG = {
  maxRetries: 5,
  baseDelay: 1000, // 1s
  maxDelay: 16000, // 16s
  backoffMultiplier: 2,
};

/** Sync queue priorities */
export const SYNC_PRIORITIES = {
  NORMAL: 0,
  HIGH: 1,
  CRITICAL: 2,
} as const;

/** Supported languages */
export const SUPPORTED_LANGUAGES = ['en', 'ur', 'pb'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/** Crop seasons */
export const CROP_SEASONS = ['rabi', 'kharif', 'zaid'] as const;
export type CropSeason = typeof CROP_SEASONS[number];

/** Disease severity levels */
export const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'] as const;
export type SeverityLevel = typeof SEVERITY_LEVELS[number];

/** Water needs levels */
export const WATER_NEEDS = ['low', 'medium', 'high'] as const;

/** Rate limiting */
export const RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  max: 100, // 100 requests per window
};

/** Soft delete retention (30 days in ms) */
export const SOFT_DELETE_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

/** Low storage threshold (50MB) - Edge case #8 */
export const LOW_STORAGE_THRESHOLD_MB = 50;

/** Health check response */
export const HEALTH_STATUS = {
  OK: 'ok',
  DEGRADED: 'degraded',
  DOWN: 'down',
} as const;
