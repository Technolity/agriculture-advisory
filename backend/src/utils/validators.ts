/**
 * Input Validators
 * Zod schemas for request validation
 * @module utils/validators
 */

import { z } from 'zod';

/** Registration validator */
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  language: z.enum(['en', 'ur', 'pb']).default('en'),
  region: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  deviceId: z.string().optional(),
});

/** Login validator */
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  deviceId: z.string().optional(),
});

/** Disease detection validator */
export const diseaseDetectionSchema = z.object({
  cropId: z.string().uuid().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  offlineCreatedAt: z.string().datetime().optional(),
});

/** Weather query validator */
export const weatherQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

/** Price query validator */
export const priceQuerySchema = z.object({
  region: z.string().min(1, 'Region is required'),
  crop_ids: z.string().optional(), // Comma-separated
});

/** Sync queue validator */
export const syncQueueSchema = z.object({
  items: z.array(
    z.object({
      actionType: z.string(),
      payload: z.record(z.unknown()),
      priority: z.number().int().min(0).max(2).default(0),
      offlineCreatedAt: z.string().datetime().optional(),
    })
  ),
});

/** Pagination validator */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/** Crop filter validator */
export const cropFilterSchema = z.object({
  region: z.string().optional(),
  season: z.enum(['rabi', 'kharif', 'zaid']).optional(),
  search: z.string().optional(),
});
