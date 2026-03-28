/**
 * Request Logging Middleware
 * Logs incoming requests and response times
 * @module middleware/logging
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Log all incoming HTTP requests
 * Includes method, URL, status code, and response time
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;

    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error(logData, 'Request completed with server error');
    } else if (res.statusCode >= 400) {
      logger.warn(logData, 'Request completed with client error');
    } else {
      logger.info(logData, 'Request completed');
    }
  });

  next();
}
