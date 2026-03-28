/**
 * useLocalStorage Hook
 * Manages local storage read/write with React state
 * Edge case #8: Warns when <50MB storage available
 * @module hooks/useLocalStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { saveToStorage, readFromStorage, removeFromStorage } from '../services/offlineStorageService';

/**
 * Hook for persistent local storage with React state
 * @param key - Storage key
 * @param initialValue - Default value if key not found
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [key]);

  const loadFromStorage = async () => {
    try {
      const value = await readFromStorage<T>(key);
      if (value !== null) {
        setStoredValue(value);
      }
    } catch (error) {
      console.error('[useLocalStorage] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = useCallback(async (value: T | ((prev: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      await saveToStorage(key, newValue);
    } catch (error) {
      console.error('[useLocalStorage] Save error:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await removeFromStorage(key);
    } catch (error) {
      console.error('[useLocalStorage] Remove error:', error);
    }
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue, isLoading };
}

export default useLocalStorage;
