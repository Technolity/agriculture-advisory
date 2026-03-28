/**
 * Weather Service
 * Handles weather data retrieval and caching
 * @module services/weatherService
 */

import axios from 'axios';
import { getPrismaClient } from '../config/database';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { WeatherResponse } from '../types';
import { WEATHER_API_TIMEOUT } from '../utils/constants';

/**
 * Get weather data for coordinates
 * Checks cache first, then calls OpenWeatherMap API
 * Edge case #3: Timeout on API calls
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Weather data
 */
export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse | null> {
  const prisma = getPrismaClient();

  // Check cache (data less than 1 hour old)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const cached = await prisma.weatherData.findFirst({
    where: {
      latitude: { gte: latitude - 0.01, lte: latitude + 0.01 },
      longitude: { gte: longitude - 0.01, lte: longitude + 0.01 },
      lastSynced: { gte: oneHourAgo },
    },
    orderBy: { lastSynced: 'desc' },
  });

  if (cached) {
    logger.debug({ latitude, longitude }, 'Returning cached weather data');
    return {
      temperature: cached.temperature || 0,
      humidity: cached.humidity || 0,
      rainfall: cached.rainfall || 0,
      windSpeed: cached.windSpeed || 0,
      condition: cached.condition || 'unknown',
      forecastDate: cached.forecastDate.toISOString(),
    };
  }

  // Call OpenWeatherMap API (placeholder)
  if (!env.OPENWEATHERMAP_API_KEY) {
    logger.warn('OPENWEATHERMAP_API_KEY not set - returning null');
    return null;
  }

  try {
    // Determine which provider to use (environment variable or default to openweathermap)
    const provider = env.WEATHER_PROVIDER || 'openweathermap';

    if (provider === 'apify') {
      // TODO: Implement Apify weather actor call
      logger.info({ latitude, longitude }, 'Apify weather provider selected but not yet implemented');
      return null;
    }

    // Primary: OpenWeatherMap
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: env.OPENWEATHERMAP_API_KEY,
          units: 'metric',
        },
        timeout: WEATHER_API_TIMEOUT,
      }
    );

    const { main, weather, wind } = response.data;
    const weatherData = {
      latitude,
      longitude,
      temperature: main.temp,
      humidity: main.humidity,
      condition: weather[0]?.main || 'unknown',
      windSpeed: wind?.speed || 0,
      rainfall: 0, // OpenWeatherMap requires separate call for rainfall
      forecastDate: new Date(),
    };

    // Store in cache
    const cached = await prisma.weatherData.create({
      data: weatherData,
    });

    logger.info({ latitude, longitude, temperature: main.temp }, 'Weather data fetched and cached');

    return {
      temperature: cached.temperature || 0,
      humidity: cached.humidity || 0,
      rainfall: cached.rainfall || 0,
      windSpeed: cached.windSpeed || 0,
      condition: cached.condition || 'unknown',
      forecastDate: cached.forecastDate.toISOString(),
    };
  } catch (error) {
    logger.error({ error, latitude, longitude }, 'Weather API call failed');
    return null;
  }
}
