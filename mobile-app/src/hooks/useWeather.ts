/**
 * useWeather Hook
 * Manages weather data fetching and caching
 * @module hooks/useWeather
 */

import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';
import { getWeatherData, getCachedWeather } from '../services/weatherService';

/**
 * Hook to manage weather data
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 */
export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    } else {
      // Try loading cached data
      loadCachedWeather();
    }
  }, [latitude, longitude]);

  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(lat, lng);
      if (data) {
        setWeather(data as WeatherData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather';
      setError(message);
      // Try cached data as fallback
      await loadCachedWeather();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCachedWeather = async () => {
    const cached = await getCachedWeather();
    if (cached) {
      setWeather(cached as WeatherData);
    }
  };

  const refresh = useCallback(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude, fetchWeather]);

  return { weather, isLoading, error, refresh };
}

export default useWeather;
