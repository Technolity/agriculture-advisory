/**
 * Health Controller
 * Health check and system status
 * @module controllers/healthController
 */

import { Request, Response } from 'express';
import { HEALTH_STATUS } from '../utils/constants';

/**
 * GET /health
 * Returns system health status
 */
export function healthCheck(_req: Request, res: Response): void {
  res.status(200).json({
    status: HEALTH_STATUS.OK,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
}
