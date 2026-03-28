/**
 * Mobile App Constants
 * @module utils/constants
 */

/** API Configuration */
export const API_URL = process.env.EXPO_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000; // Edge case #3

/** Retry Configuration - Edge case #2 */
export const RETRY_CONFIG = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 16000,
  backoffMultiplier: 2,
};

/** Image Configuration - Edge case #4 */
export const MAX_IMAGE_SIZE_KB = 500;
export const IMAGE_QUALITY = 0.7;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Storage Thresholds - Edge case #8 */
export const LOW_STORAGE_THRESHOLD_MB = 50;

/** Supported Languages */
export const LANGUAGES = {
  en: { label: 'English', native: 'English' },
  ur: { label: 'Urdu', native: 'اردو' },
  pb: { label: 'Punjabi', native: 'پنجابی' },
} as const;

/** Crop Seasons */
export const SEASONS = {
  rabi: { label: 'Rabi (Winter)', months: 'Oct-Mar', color: '#1565C0' },
  kharif: { label: 'Kharif (Monsoon)', months: 'Jun-Oct', color: '#2E7D32' },
  zaid: { label: 'Zaid (Summer)', months: 'Mar-Jun', color: '#F57F17' },
} as const;

/** Disease Severity Colors */
export const SEVERITY_COLORS = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336',
  critical: '#9C27B0',
} as const;

/** App Theme Colors */
export const COLORS = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  secondary: '#FF6F00',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#C62828',
  warning: '#F57F17',
  info: '#1565C0',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',
} as const;
