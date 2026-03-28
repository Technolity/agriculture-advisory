/**
 * Authentication Middleware
 * JWT token verification and user context injection
 * @module middleware/auth
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AuthenticatedRequest, JwtPayload } from '../types';

/**
 * Verify JWT token and attach user to request
 * Extracts token from Authorization header (Bearer scheme)
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide a valid token.',
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired. Please login again.',
        },
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token.',
        },
      });
      return;
    }

    logger.error({ error }, 'Authentication middleware error');
    next(error);
  }
}

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for endpoints that work for both authenticated and anonymous users
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = { userId: decoded.userId, email: decoded.email };
    }
  } catch {
    // Token invalid - continue without user context
  }

  next();
}
