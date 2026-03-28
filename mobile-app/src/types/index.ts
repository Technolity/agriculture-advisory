/**
 * Mobile App TypeScript Type Definitions
 * Shared interfaces and types
 * @module types
 */

// ============================================================
// Navigation Types
// ============================================================

export type RootTabParamList = {
  Home: undefined;
  DiseaseDetection: undefined;
  PlantingGuide: undefined;
  MarketPrice: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  OfflineMap: undefined;
  CropDetail: { cropId: string };
  DiseaseResult: { detectionId: string };
};

// ============================================================
// Entity Types
// ============================================================

export interface User {
  id: string;
  email: string;
  name: string;
  language: 'en' | 'ur' | 'pb';
  region?: string;
  latitude?: number;
  longitude?: number;
}

export interface Crop {
  id: string;
  name: string;
  nameUrdu?: string;
  namePunjabi?: string;
  region: string;
  season: 'rabi' | 'kharif' | 'zaid';
  plantingMonth: number;
  harvestMonth: number;
  waterNeeds: 'low' | 'medium' | 'high';
  soilType: string;
}

export interface Disease {
  id: string;
  cropId: string;
  name: string;
  nameUrdu?: string;
  symptoms: string;
  treatment: string;
  treatmentUrdu?: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface DiseaseDetection {
  id: string;
  cropId?: string;
  diseaseId?: string;
  imageUri?: string;
  confidence: number;
  isCorrect?: boolean;
  offlineCreatedAt?: string;
  syncedAt?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  forecastDate: string;
}

export interface MarketPrice {
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

export interface SyncQueueItem {
  id: string;
  actionType: string;
  payload: Record<string, unknown>;
  priority: number;
  retryCount: number;
  createdAt: string;
}

// ============================================================
// API Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

// ============================================================
// App State Types
// ============================================================

export type NetworkStatus = 'online' | 'offline' | 'unknown';
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'complete';
export type AppLanguage = 'en' | 'ur' | 'pb';
