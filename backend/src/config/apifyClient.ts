/**
 * Apify Client Configuration
 * Initializes the Apify client for web scraping tasks
 * @module config/apifyClient
 */

import { ApifyClient } from 'apify-client';
import { env } from './env';
import { logger } from '../utils/logger';

let client: ApifyClient | null = null;

/**
 * Initialize the Apify client
 * Returns null gracefully if token is not configured
 */
export function initApifyClient(): ApifyClient | null {
  if (!env.APIFY_API_TOKEN) {
    logger.info('APIFY_API_TOKEN not set - Apify integration disabled');
    return null;
  }

  client = new ApifyClient({
    token: env.APIFY_API_TOKEN,
  });

  logger.info('Apify client initialized');
  return client;
}

/**
 * Get the initialized Apify client
 * Returns null if not initialized or token not configured
 */
export function getApifyClient(): ApifyClient | null {
  if (!client && env.APIFY_API_TOKEN) {
    return initApifyClient();
  }
  return client;
}
