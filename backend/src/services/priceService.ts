/**
 * Market Price Service
 * Handles market price data retrieval
 * @module services/priceService
 */

import { getPrismaClient } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Get market prices by region and optional crop IDs
 * @param region - Market region
 * @param cropIds - Optional list of crop IDs to filter
 * @returns List of market prices
 */
export async function getMarketPrices(region: string, cropIds?: string[]) {
  const prisma = getPrismaClient();

  const where: Record<string, unknown> = {
    marketRegion: { contains: region, mode: 'insensitive' },
  };

  if (cropIds && cropIds.length > 0) {
    where.cropId = { in: cropIds };
  }

  const prices = await prisma.marketPrice.findMany({
    where,
    include: {
      crop: {
        select: { id: true, name: true, nameUrdu: true, namePunjabi: true },
      },
    },
    orderBy: { lastUpdated: 'desc' },
  });

  logger.debug({ region, count: prices.length }, 'Market prices retrieved');

  return prices;
}

/**
 * Update market price for a crop
 * @param cropId - Crop ID
 * @param marketName - Market name
 * @param marketRegion - Market region
 * @param pricePerUnit - Price per unit
 * @param unit - Unit of measurement
 */
export async function updateMarketPrice(
  cropId: string,
  marketName: string,
  marketRegion: string,
  pricePerUnit: number,
  unit: string
) {
  const prisma = getPrismaClient();

  const price = await prisma.marketPrice.upsert({
    where: {
      unique_crop_market: { cropId, marketName },
    },
    update: {
      pricePerUnit,
      marketRegion,
      unit,
      lastUpdated: new Date(),
    },
    create: {
      cropId,
      marketName,
      marketRegion,
      pricePerUnit,
      unit,
    },
  });

  logger.info({ cropId, marketName, pricePerUnit }, 'Market price updated');
  return price;
}
