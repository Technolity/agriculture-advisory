/**
 * Redis Configuration
 * Redis client for caching and session management
 * @module config/redis
 */

import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { env } from './env';

let redisClient: RedisClientType;

/**
 * Initialize Redis client connection
 * Falls back gracefully if Redis is unavailable
 */
export async function initRedis(): Promise<RedisClientType | null> {
  try {
    redisClient = createClient({
      url: env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      logger.error({ err }, 'Redis Client Error');
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client connected');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis Client reconnecting...');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn({ error }, 'Redis connection failed - running without cache');
    return null;
  }
}

/**
 * Get the Redis client instance
 */
export function getRedisClient(): RedisClientType | null {
  return redisClient || null;
}

/**
 * Disconnect Redis client gracefully
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.disconnect();
    logger.info('Redis disconnected');
  }
}

export { redisClient };
