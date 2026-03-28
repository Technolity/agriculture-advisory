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
    const client = createClient({ url: env.REDIS_URL, socket: { connectTimeout: 3000 } });

    // Silence reconnection spam — Redis is optional in dev
    client.on('error', () => {});
    client.on('reconnecting', () => {});

    await client.connect();
    redisClient = client as RedisClientType;
    logger.info('Redis Client connected');
    return redisClient;
  } catch {
    logger.warn('Redis unavailable - running without cache (OK for dev)');
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
