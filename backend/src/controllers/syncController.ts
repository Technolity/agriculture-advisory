/**
 * Sync Controller
 * Handles offline sync queue HTTP requests
 * @module controllers/syncController
 */

import { Response, NextFunction } from 'express';
import { processSyncQueue } from '../services/syncService';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../middleware/errorHandler';

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

    const result = await processSyncQueue(req.user.userId, items);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
