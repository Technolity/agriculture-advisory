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
    // TODO: Implement actual OpenWeatherMap API call
    // const response = await axios.get(
    //   `https://api.openweathermap.org/data/2.5/weather`,
    //   {
    //     params: { lat: latitude, lon: longitude, appid: env.OPENWEATHERMAP_API_KEY, units: 'metric' },
    //     timeout: WEATHER_API_TIMEOUT,
    //   }
    // );

    logger.info({ latitude, longitude }, 'Weather API call (placeholder)');
    console.log(`[Weather] Would fetch weather for ${latitude}, ${longitude}`);

    return null;
  } catch (error) {
    logger.error({ error, latitude, longitude }, 'Weather API call failed');
    return null;
  }
}
