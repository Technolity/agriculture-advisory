/**
 * Market Price Service
 * Fetches and caches market price data
 * @module services/marketPriceService
 */

import { MarketPrice } from '../types';

/**
 * Get market prices for a region
 * @param region - Market region
 * @param cropIds - Optional crop IDs to filter
 */
export async function getMarketPrices(
  region: string,
  cropIds?: string[]
): Promise<MarketPrice[]> {
  try {
    // TODO: Fetch from backend API
    // TODO: Fall back to cached data if offline
    console.log('[PriceService] Fetching prices for:', { region, cropIds });
    return [];
  } catch (error) {
    console.error('[PriceService] Failed:', error);
    return [];
  }
}

/**
 * Get cached prices from local storage
 */
export async function getCachedPrices(): Promise<MarketPrice[]> {
  try {
    // TODO: Read from SQLite or AsyncStorage
    return [];
  } catch (error) {
    console.error('[PriceService] Cache read failed:', error);
    return [];
  }
}
