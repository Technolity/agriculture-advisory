/**
 * Database Configuration
 * Prisma Client singleton for database access
 * @module config/database
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

/** Prisma Client singleton instance */
let prisma: PrismaClient;

/**
 * Get or create the Prisma Client instance
 * Uses singleton pattern to prevent multiple connections in development
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query' as never, (e: unknown) => {
        logger.debug({ event: e }, 'Prisma Query');
      });
    }

    logger.info('Prisma Client initialized');
  }

  return prisma;
}

/**
 * Disconnect Prisma Client gracefully
 */
export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
}

export { prisma };
export default getPrismaClient;
