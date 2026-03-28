/**
 * Weather Routes
 * @module routes/weather
 */

import { Router } from 'express';
import { getWeatherData } from '../controllers/weatherController';
import { validateQuery } from '../middleware/validator';
import { weatherQuerySchema } from '../utils/validators';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/** GET /weather?latitude=X&longitude=Y - Get weather data */
router.get('/', optionalAuth, validateQuery(weatherQuerySchema), getWeatherData);

export default router;
