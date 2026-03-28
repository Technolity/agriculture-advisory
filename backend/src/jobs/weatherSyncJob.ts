/**
 * Weather Sync Job
 * Periodically fetches and caches weather data for active users
 * @module jobs/weatherSyncJob
 */

import { logger } from '../utils/logger';

/** Sync interval: 1 hour */
const SYNC_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Start the weather sync job
 * Runs on a fixed interval to update weather data for active users
 */
export function startWeatherSyncJob(): void {
  logger.info('Weather sync job started');

  setInterval(async () => {
    try {
      // TODO: Implement weather data sync
      // 1. Get all active users with lat/lng
      // 2. Batch fetch weather data from OpenWeatherMap
      // 3. Update weather_data table
      logger.debug('Weather sync job tick (placeholder)');
    } catch (error) {
      logger.error({ error }, 'Weather sync job failed');
    }
  }, SYNC_INTERVAL_MS);
}
