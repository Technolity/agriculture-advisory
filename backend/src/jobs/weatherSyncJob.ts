/**
 * Weather Sync Job
 * Periodically fetches and caches weather data for active users
 * @module jobs/weatherSyncJob
 */

import { getPrismaClient } from '../config/database';
import { getWeather } from '../services/weatherService';
import { logger } from '../utils/logger';

/** Sync interval: 1 hour */
const SYNC_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Start the weather sync job
 * Runs on a fixed interval to update weather data for active users
 */
export function startWeatherSyncJob(): void {
  logger.info('Weather sync job started (1 hour interval)');

  setInterval(async () => {
    try {
      const prisma = getPrismaClient();

      // Get all active users with coordinates
      const users = await prisma.user.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
          deletedAt: null,
        },
        select: {
          id: true,
          latitude: true,
          longitude: true,
        },
        distinct: ['latitude', 'longitude'],
      });

      if (users.length === 0) {
        logger.debug('No users with location data for weather sync');
        return;
      }

      // Deduplicate locations by rounding to 2 decimal places
      const uniqueLocations = new Map<string, { latitude: number; longitude: number }>();
      for (const user of users) {
        if (user.latitude && user.longitude) {
          const key = `${Math.round(user.latitude * 100) / 100},${Math.round(user.longitude * 100) / 100}`;
          if (!uniqueLocations.has(key)) {
            uniqueLocations.set(key, {
              latitude: Math.round(user.latitude * 100) / 100,
              longitude: Math.round(user.longitude * 100) / 100,
            });
          }
        }
      }

      // Fetch weather for each unique location
      let successCount = 0;
      for (const { latitude, longitude } of uniqueLocations.values()) {
        const result = await getWeather(latitude, longitude);
        if (result) {
          successCount++;
        }
      }

      logger.info(
        { locations: uniqueLocations.size, successCount },
        'Weather sync job completed'
      );
    } catch (error) {
      logger.error({ error }, 'Weather sync job failed');
    }
  }, SYNC_INTERVAL_MS);
}
