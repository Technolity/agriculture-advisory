/**
 * Price Controller
 * Handles market price HTTP requests
 * @module controllers/priceController
 */

import { Request, Response, NextFunction } from 'express';
import { getMarketPrices } from '../services/priceService';
import { ValidationError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * GET /prices?region=Kashmir&crop_ids=id1,id2
 * Get market prices for crops in a region
 */
export async function getPrices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const region = req.query.region as string;
    if (!region) {
      throw new ValidationError('Region parameter is required');
    }

    const cropIdsParam = req.query.crop_ids as string | undefined;
    const cropIds = cropIdsParam ? cropIdsParam.split(',').map((id) => id.trim()) : undefined;

    logger.info({ route: req.path, region, cropIds }, 'Market prices request');

    const prices = await getMarketPrices(region, cropIds);

    res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error) {
    next(error);
  }
}
