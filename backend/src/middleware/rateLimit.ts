/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per user/IP
 * @module middleware/rateLimit
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Default rate limiter
 * 100 requests per minute per IP
 */
export const defaultRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
});

/**
 * Strict rate limiter for auth endpoints
 * 10 requests per minute per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 60000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
    },
  },
});

/**
 * Upload rate limiter for image endpoints
 * 20 requests per minute per IP
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many upload requests. Please try again later.',
    },
  },
});
