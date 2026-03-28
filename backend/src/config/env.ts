/**
 * Environment Configuration
 * Zod-validated environment variables
 * @module config/env
 */

import 'dotenv/config';
import { z } from 'zod';

/** Environment variable schema with validation */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  DATABASE_CONNECT_TIMEOUT_SEC: z.coerce.number().int().positive().default(30),
  DATABASE_CONNECT_RETRIES: z.coerce.number().int().positive().default(5),
  DATABASE_CONNECT_RETRY_DELAY_MS: z.coerce.number().int().positive().default(2000),

  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // Authentication
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // External APIs
  OPENAI_API_KEY: z.string().optional(),
  OPENWEATHERMAP_API_KEY: z.string().optional(),
  APIFY_API_TOKEN: z.string().optional(),
  WEATHER_PROVIDER: z.enum(['openweathermap', 'apify']).default('openweathermap'),

  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  HOST: z.string().default('0.0.0.0'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Image Upload
  MAX_IMAGE_SIZE_KB: z.coerce.number().default(500),
  UPLOAD_DIR: z.string().default('./uploads'),
});

/** Validated environment type */
export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Throws detailed error if validation fails
 */
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
}

/** Validated environment variables */
export const env = validateEnv();
