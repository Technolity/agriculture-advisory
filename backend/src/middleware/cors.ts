/**
 * CORS Middleware Configuration
 * @module middleware/cors
 */

import cors from 'cors';
import { env } from '../config/env';

/** Allowed origins based on environment */
const allowedOrigins =
  env.NODE_ENV === 'production'
    ? ['https://agricultural-advisory.app'] // Update with production URL
    : ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:19006', 'exp://localhost:19000'];

/** CORS configuration */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  credentials: true,
  maxAge: 86400, // 24 hours
});
