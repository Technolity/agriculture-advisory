/**
 * Offline Storage Service
 * SQLite + AsyncStorage for offline-first data persistence
 * @module services/offlineStorageService
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@user',
  TOKEN: '@token',
  CROPS: '@crops',
  DISEASES: '@diseases',
  WEATHER: '@weather',
  PRICES: '@prices',
  LANGUAGE: '@language',
  SYNC_QUEUE: '@sync_queue',
} as const;

/**
 * Save data to local storage
 * @param key - Storage key
 * @param value - Data to store (will be JSON stringified)
 */
export async function saveToStorage(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('[OfflineStorage] Save failed:', { key, error });
    throw error;
  }
}

/**
 * Read data from local storage
 * @param key - Storage key
 * @returns Parsed data or null
 */
export async function readFromStorage<T>(key: string): Promise<T | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('[OfflineStorage] Read failed:', { key, error });
    return null;
  }
}

/**
 * Remove data from local storage
 * @param key - Storage key
 */
export async function removeFromStorage(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('[OfflineStorage] Remove failed:', { key, error });
  }
}

/**
 * Clear all app data from storage
 */
export async function clearAllStorage(): Promise<void> {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('[OfflineStorage] Clear all failed:', error);
  }
}

/**
 * Get storage usage info
 * Edge case #8: Warn when <50MB free
 */
export async function getStorageInfo(): Promise<{ usedKeys: number }> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return { usedKeys: keys.length };
  } catch (error) {
    return { usedKeys: 0 };
  }
}

export { STORAGE_KEYS };
