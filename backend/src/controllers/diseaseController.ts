/**
 * Disease Controller
 * Handles disease detection HTTP requests
 * @module controllers/diseaseController
 */

import { Response, NextFunction } from 'express';
import { detectDisease } from '../services/diseaseService';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../middleware/errorHandler';

/**
 * POST /diseases/detect
 * Upload image for disease classification
 * Uses multer for file upload middleware
 */
export async function detect(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new ValidationError('Authentication required');
    }

    const file = req.file;
    if (!file) {
      throw new ValidationError('Image file is required');
    }

    const cropId = req.body.cropId as string | undefined;

    const result = await detectDisease(
      req.user.userId,
      file.buffer,
      file.mimetype,
      cropId
    );

    res.status(200).json({
      success: true,
      data: result || {
        message: 'Disease detection is being processed. Check back later for results.',
      },
    });
  } catch (error) {
    next(error);
  }
}
