/**
 * Express Application Entry Point
 * Agricultural Advisory API Server
 * @module index
 */

import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initRedis, disconnectRedis } from './config/redis';
import { initClaudeClient } from './config/claudeClient';
import { corsMiddleware } from './middleware/cors';
import { requestLogger } from './middleware/logging';
import { defaultRateLimiter } from './middleware/rateLimit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { API_PREFIX } from './utils/constants';

// Import routes
import authRoutes from './routes/auth.routes';
import cropRoutes from './routes/crops.routes';
import diseaseRoutes from './routes/disease.routes';
import weatherRoutes from './routes/weather.routes';
import priceRoutes from './routes/prices.routes';
import syncRoutes from './routes/sync.routes';
import healthRoutes from './routes/health.routes';
import marketplaceRoutes from './routes/marketplace.routes';

// Import background jobs
import { startWeatherSyncJob } from './jobs/weatherSyncJob';
import { startPriceSyncJob } from './jobs/priceSyncJob';

const app = express();

// ============================================================
// Global Middleware
// ============================================================

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(defaultRateLimiter);

// ============================================================
// API Routes
// ============================================================

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/crops`, cropRoutes);
app.use(`${API_PREFIX}/diseases`, diseaseRoutes);
app.use(`${API_PREFIX}/weather`, weatherRoutes);
app.use(`${API_PREFIX}/prices`, priceRoutes);
app.use(`${API_PREFIX}/sync`, syncRoutes);
app.use(`${API_PREFIX}/marketplace`, marketplaceRoutes);
app.use('/health', healthRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Agricultural Advisory API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health',
  });
});

// ============================================================
// Error Handling
// ============================================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// Server Startup
// ============================================================

async function startServer(): Promise<void> {
  try {
    // Initialize database
    await connectDatabase();

    // Initialize Redis (optional - graceful fallback)
    await initRedis();

    // Initialize OpenAI API client (optional)
    initClaudeClient();

    // Start background jobs
    startWeatherSyncJob();
    startPriceSyncJob();

    // Start HTTP server
    const server = app.listen(env.PORT, env.HOST, () => {
      logger.info(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
      logger.info(`📋 API available at http://${env.HOST}:${env.PORT}${API_PREFIX}`);
      logger.info(`❤️  Health check at http://${env.HOST}:${env.PORT}/health`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        await disconnectRedis();
        logger.info('Server closed');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

// On Vercel (serverless) skip app.listen — Vercel calls the exported handler directly.
// On local / traditional servers, start normally.
if (process.env.VERCEL) {
  // Initialize connections once per cold start (no HTTP server needed)
  (async () => {
    await connectDatabase();
    await initRedis();   // graceful — falls back if Redis URL is unavailable
    initClaudeClient();
    // Background jobs are not available in serverless — use Vercel Cron Jobs instead
    logger.info('Serverless init complete');
  })().catch((err) => logger.error({ err }, 'Serverless init failed'));
} else {
  startServer();
}

export default app;
