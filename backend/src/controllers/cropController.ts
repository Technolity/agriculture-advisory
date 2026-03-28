/**
 * Crops Controller
 * Handles crop-related HTTP requests
 * @module controllers/cropController
 */

import { Request, Response, NextFunction } from 'express';
import { listCrops, getCropById } from '../services/cropService';
import { getDiseasesByCrop } from '../services/diseaseService';
import { NotFoundError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * GET /crops
 * List all crops with optional filters
 */
export async function getCrops(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = {
      region: req.query.region as string | undefined,
      season: req.query.season as string | undefined,
      search: req.query.search as string | undefined,
    };

    const pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    logger.info({ route: req.path, filters, pagination }, 'Crops list request');

    const result = await listCrops(filters, pagination);

    res.status(200).json({
      success: true,
      data: result.crops,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /crops/:id/diseases
 * Get diseases for a specific crop
 */
export async function getCropDiseases(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    logger.info({ route: req.path, cropId: id }, 'Crop diseases request');

    const crop = await getCropById(id);
    if (!crop) {
      throw new NotFoundError('Crop');
    }

    const diseases = await getDiseasesByCrop(id);

    res.status(200).json({
      success: true,
      data: {
        crop: { id: crop.id, name: crop.name },
        diseases,
      },
    });
  } catch (error) {
    next(error);
  }
}
