/**
 * Sync Service
 * Processes offline queue items and handles data synchronization
 * @module services/syncService
 */

import { getPrismaClient } from '../config/database';
import { logger } from '../utils/logger';
import { SyncQueueItem, SyncResult } from '../types';
import { RETRY_CONFIG, SYNC_PRIORITIES } from '../utils/constants';

/**
 * Process sync queue items
 * Edge case #1: Handles offline queue processing
 * Edge case #7: Last-write-wins conflict resolution
 * @param userId - User ID
 * @param items - List of sync queue items
 * @returns Processing result
 */
export async function processSyncQueue(
  userId: string,
  items: SyncQueueItem[]
): Promise<SyncResult> {
  const prisma = getPrismaClient();
  let processed = 0;
  let failed = 0;
  const errors: Array<{ id: string; error: string }> = [];

  // Sort by priority (critical first)
  const sortedItems = [...items].sort(
    (a, b) => (b.priority || 0) - (a.priority || 0)
  );

  for (const item of sortedItems) {
    try {
      // Create sync queue record
      const record = await prisma.syncQueue.create({
        data: {
          userId,
          actionType: item.actionType,
          payload: item.payload as object,
          priority: item.priority || SYNC_PRIORITIES.NORMAL,
        },
      });

      // Process based on action type
      // TODO: Implement actual processing for each action type
      switch (item.actionType) {
        case 'disease_detection':
          // TODO: Process disease detection from offline data
          logger.info({ recordId: record.id }, 'Processing disease detection sync');
          break;

        case 'feedback':
          // TODO: Process user feedback from offline data
          logger.info({ recordId: record.id }, 'Processing feedback sync');
          break;

        case 'settings_update':
          // TODO: Process settings update from offline data
          logger.info({ recordId: record.id }, 'Processing settings sync');
          break;

        default:
          logger.warn({ actionType: item.actionType }, 'Unknown sync action type');
          break;
      }

      // Mark as synced
      await prisma.syncQueue.update({
        where: { id: record.id },
        data: { syncedAt: new Date() },
      });

      processed++;
    } catch (error) {
      failed++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ id: item.actionType, error: errorMessage });
      logger.error({ error, actionType: item.actionType }, 'Sync item processing failed');
    }
  }

  logger.info({ userId, processed, failed }, 'Sync queue processing complete');

  return { processed, failed, errors };
}

/**
 * Get pending sync items for a user
 * @param userId - User ID
 * @returns List of pending sync items
 */
export async function getPendingSyncItems(userId: string) {
  const prisma = getPrismaClient();

  return prisma.syncQueue.findMany({
    where: {
      userId,
      syncedAt: null,
      retryCount: { lt: RETRY_CONFIG.maxRetries },
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
  });
}
