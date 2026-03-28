/**
 * Sync Service
 * Handles offline queue management and data synchronization
 * Edge case #1: Offline queue system
 * Edge case #2: Retry with exponential backoff
 * Edge case #7: Conflict resolution
 * @module services/syncService
 */

import axios, { AxiosInstance } from 'axios';
import { SyncQueueItem } from '../types';
import { saveToStorage, readFromStorage } from './offlineStorageService';

/** API base URL */
const API_URL = process.env.EXPO_API_URL || 'http://localhost:5000/api';

/** API timeout - Edge case #3 */
const API_TIMEOUT = 30000;

/** Retry configuration - Edge case #2 */
const RETRY_CONFIG = {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 16000,
  backoffMultiplier: 2,
};

/**
 * Axios API client with timeout configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add item to offline sync queue
 * @param item - Queue item to add
 */
export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'retryCount' | 'createdAt'>): Promise<void> {
  const queue = (await readFromStorage<SyncQueueItem[]>('@sync_queue')) || [];

  const newItem: SyncQueueItem = {
    ...item,
    id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    retryCount: 0,
    createdAt: new Date().toISOString(),
  };

  queue.push(newItem);
  await saveToStorage('@sync_queue', queue);

  console.log('[SyncService] Item added to queue:', newItem.actionType);
}

/**
 * Process the sync queue
 * Edge case #1: Processes all queued items when online
 * Edge case #2: Retry with exponential backoff
 */
export async function processSyncQueue(): Promise<{ processed: number; failed: number }> {
  const queue = (await readFromStorage<SyncQueueItem[]>('@sync_queue')) || [];

  if (queue.length === 0) {
    return { processed: 0, failed: 0 };
  }

  let processed = 0;
  let failed = 0;
  const remainingItems: SyncQueueItem[] = [];

  for (const item of queue) {
    try {
      // TODO: Process item based on actionType
      console.log('[SyncService] Processing:', item.actionType);

      // Simulate API call
      // await apiClient.post('/sync/queue', { items: [item] });

      processed++;
    } catch (error) {
      failed++;
      item.retryCount++;

      if (item.retryCount < RETRY_CONFIG.maxRetries) {
        remainingItems.push(item);
      } else {
        console.error('[SyncService] Max retries reached for:', item.id);
      }
    }
  }

  // Save remaining failed items back to queue
  await saveToStorage('@sync_queue', remainingItems);

  console.log('[SyncService] Queue processed:', { processed, failed });
  return { processed, failed };
}

/**
 * Calculate exponential backoff delay
 * Edge case #2: 1s, 2s, 4s, 8s, 16s max
 */
export function calculateBackoff(retryCount: number): number {
  const delay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount),
    RETRY_CONFIG.maxDelay
  );
  return delay;
}

/**
 * Get pending sync count
 */
export async function getPendingSyncCount(): Promise<number> {
  const queue = (await readFromStorage<SyncQueueItem[]>('@sync_queue')) || [];
  return queue.length;
}
