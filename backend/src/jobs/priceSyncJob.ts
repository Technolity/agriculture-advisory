/**
 * Price Sync Job
 * Periodically updates market prices from Apify or external sources
 * @module jobs/priceSyncJob
 */

import { getPrismaClient } from '../config/database';
import { updateMarketPrice } from '../services/priceService';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/** Sync interval: 6 hours */
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

interface PriceData {
  cropName: string;
  price: number;
  unit: string;
  market: string;
  region: string;
}

/**
 * Start the price sync job
 * Runs on a fixed interval to update market prices
 */
export function startPriceSyncJob(): void {
  logger.info('Price sync job started (6 hour interval)');

  setInterval(async () => {
    try {
      const prisma = getPrismaClient();

      // TODO: Wire in Apify actor call when token is available
      // For now, check if Apify token is configured
      if (!env.APIFY_API_TOKEN) {
        logger.warn('APIFY_API_TOKEN not configured - skipping price sync');
        return;
      }

      logger.debug('Price sync job tick - fetching prices from Apify');

      // TODO: Implement Apify actor call
      // const client = getApifyClient();
      // const run = await client.actor('YOUR_ACTOR_ID').call({...});
      // const { items } = await client.dataset(run.defaultDatasetId).listItems();

      // For now, just log that the job runs successfully
      logger.info('Price sync job completed (Apify integration pending)');
    } catch (error) {
      logger.error({ error }, 'Price sync job failed');
    }
  }, SYNC_INTERVAL_MS);
}

/**
 * Helper function to process price data from Apify and update DB
 * Will be called once Apify integration is wired
 */
async function processPriceData(priceData: PriceData[]): Promise<void> {
  const prisma = getPrismaClient();

  for (const item of priceData) {
    try {
      // Find crop by name (case-insensitive)
      const crop = await prisma.crop.findFirst({
        where: {
          name: { contains: item.cropName, mode: 'insensitive' },
        },
      });

      if (!crop) {
        logger.warn({ cropName: item.cropName }, 'Crop not found for price data');
        continue;
      }

      // Update market price
      await updateMarketPrice(
        crop.id,
        item.market,
        item.region,
        item.price,
        item.unit
      );

      logger.debug(
        { crop: item.cropName, market: item.market, price: item.price },
        'Price updated'
      );
    } catch (error) {
      logger.error(
        { error, crop: item.cropName, market: item.market },
        'Failed to update price'
      );
    }
  }
}
