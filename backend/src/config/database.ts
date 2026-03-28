/**
 * Database Configuration
 * Prisma Client singleton for database access
 * @module config/database
 */

import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from '../utils/logger';

/** Prisma Client singleton instance */
let prisma: PrismaClient;

function getRuntimeDatabaseUrl(): string {
  const databaseUrl = new URL(env.DATABASE_URL);

  if (!databaseUrl.searchParams.has('connect_timeout')) {
    databaseUrl.searchParams.set(
      'connect_timeout',
      String(env.DATABASE_CONNECT_TIMEOUT_SEC)
    );
  }

  return databaseUrl.toString();
}

function getDatabaseTarget(url: string): string {
  try {
    const databaseUrl = new URL(url);
    return `${databaseUrl.hostname}:${databaseUrl.port || '5432'}`;
  } catch {
    return 'configured DATABASE_URL';
  }
}

/**
 * Get or create the Prisma Client instance
 * Uses singleton pattern to prevent multiple connections in development
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const runtimeDatabaseUrl = getRuntimeDatabaseUrl();

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: runtimeDatabaseUrl,
        },
      },
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

    logger.info(
      { database: getDatabaseTarget(runtimeDatabaseUrl) },
      'Prisma Client initialized'
    );
  }

  return prisma;
}

/**
 * Connect Prisma with retry logic for transient database or network failures.
 */
export async function connectDatabase(): Promise<PrismaClient> {
  const prismaClient = getPrismaClient();
  const database = getDatabaseTarget(getRuntimeDatabaseUrl());
  let lastError: unknown;

  for (let attempt = 1; attempt <= env.DATABASE_CONNECT_RETRIES; attempt += 1) {
    try {
      await prismaClient.$connect();
      logger.info({ attempt, database }, 'Database connected');
      return prismaClient;
    } catch (error) {
      lastError = error;

      await prismaClient.$disconnect().catch(() => undefined);

      if (attempt === env.DATABASE_CONNECT_RETRIES) {
        break;
      }

      logger.warn(
        {
          attempt,
          retries: env.DATABASE_CONNECT_RETRIES,
          retryDelayMs: env.DATABASE_CONNECT_RETRY_DELAY_MS,
          database,
          error,
        },
        'Database connection failed, retrying'
      );

      await new Promise((resolve) =>
        setTimeout(resolve, env.DATABASE_CONNECT_RETRY_DELAY_MS)
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Database connection failed');
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
