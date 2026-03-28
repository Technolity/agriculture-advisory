/**
 * Sync Controller
 * Handles offline sync queue HTTP requests
 * @module controllers/syncController
 */

import { Response, NextFunction } from 'express';
import { processSyncQueue } from '../services/syncService';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * POST /sync/queue
 * Process offline queue items
 */
export async function processQueue(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new ValidationError('Authentication required');
    }

    const { items } = req.body;

    logger.info({ userId: req.user.userId, route: req.path, itemCount: items?.length ?? 0 }, 'Sync queue processing attempt');

    const result = await processSyncQueue(req.user.userId, items);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
