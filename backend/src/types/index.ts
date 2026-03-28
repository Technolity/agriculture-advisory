/**
 * Backend TypeScript Type Definitions
 * Shared interfaces and types for the backend application
 * @module types
 */

import { Request } from 'express';

// ============================================================
// API Response Types
// ============================================================

/** Standard API success response */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

/** Standard API error response */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

// ============================================================
// Auth Types
// ============================================================

/** JWT payload structure */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/** Authenticated request with user context */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/** Registration input */
export interface RegisterInput {
  email: string;
  phone?: string;
  password: string;
  name: string;
  language?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  deviceId?: string;
}

/** Login input */
export interface LoginInput {
  email: string;
  password: string;
  deviceId?: string;
}

// ============================================================
// Disease Detection Types
// ============================================================

/** Disease detection request */
export interface DiseaseDetectionInput {
  cropId?: string;
  imageBase64?: string;
  latitude?: number;
  longitude?: number;
  offlineCreatedAt?: string;
}

/** Disease detection result */
export interface DiseaseDetectionResult {
  diseaseId: string;
  diseaseName: string;
  confidence: number;
  severity: string;
  treatment: string;
  treatmentUrdu?: string;
}

// ============================================================
// Weather Types
// ============================================================

/** Weather query parameters */
export interface WeatherQuery {
  latitude: number;
  longitude: number;
}

/** Weather response data */
export interface WeatherResponse {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  forecastDate: string;
}

// ============================================================
// Market Price Types
// ============================================================

/** Price query parameters */
export interface PriceQuery {
  region: string;
  cropIds?: string[];
}

/** Price response data */
export interface PriceResponse {
  cropId: string;
  cropName: string;
  marketName: string;
  pricePerUnit: number;
  unit: string;
  lastUpdated: string;
}

// ============================================================
// Sync Types
// ============================================================

/** Sync queue item */
export interface SyncQueueItem {
  actionType: string;
  payload: Record<string, unknown>;
  priority?: number;
  offlineCreatedAt?: string;
}

/** Sync queue processing result */
export interface SyncResult {
  processed: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

// ============================================================
// Pagination & Filtering
// ============================================================

/** Pagination parameters */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Crop filter parameters */
export interface CropFilter {
  region?: string;
  season?: string;
  search?: string;
}
