/**
 * Weather Controller
 * Handles weather data HTTP requests
 * @module controllers/weatherController
 */

import { Request, Response, NextFunction } from 'express';
import { getWeather } from '../services/weatherService';
import { logger } from '../utils/logger';

/**
 * GET /weather?latitude=X&longitude=Y
 * Get weather data for coordinates
 */
export async function getWeatherData(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);

    logger.info({ route: req.path, latitude, longitude }, 'Weather data request');

    const weather = await getWeather(latitude, longitude);

    res.status(200).json({
      success: true,
      data: weather || {
        message: 'Weather data is currently unavailable. Please try again later.',
      },
    });
  } catch (error) {
    next(error);
  }
}
