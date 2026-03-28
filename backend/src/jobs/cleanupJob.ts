/**
 * Cleanup Job
 * Handles data retention, soft delete purging, and sync queue cleanup
 * @module jobs/cleanupJob
 */

import { logger } from '../utils/logger';
import { SOFT_DELETE_RETENTION_MS } from '../utils/constants';

/** Cleanup interval: 24 hours */
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 * Start the cleanup job
 * Handles:
 * - Purging soft-deleted users after 30-day retention
 * - Cleaning processed sync queue items
 * - Removing expired sessions
 */
export function startCleanupJob(): void {
  logger.info('Cleanup job started');

  setInterval(async () => {
    try {
      // TODO: Implement cleanup logic
      // 1. Delete users where deletedAt < now() - 30 days
      // 2. Delete sync_queue items where syncedAt < now() - 7 days
      // 3. Delete expired sessions
      // 4. Remove orphaned image files
      logger.debug('Cleanup job tick (placeholder)');
    } catch (error) {
      logger.error({ error }, 'Cleanup job failed');
    }
  }, CLEANUP_INTERVAL_MS);
}
