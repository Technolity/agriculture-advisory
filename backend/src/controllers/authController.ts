/**
 * Auth Controller
 * Handles authentication HTTP requests
 * @module controllers/authController
 */

import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from '../services/authService';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types';

/**
 * POST /auth/register
 * Register a new user account
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logger.info({ route: req.path, email: req.body?.email }, 'Register attempt');
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /auth/login
 * Authenticate user with credentials
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logger.info({ route: req.path, email: req.body?.email }, 'Login attempt');
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /auth/me
 * Return the authenticated user's profile
 */
export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserById(req.user!.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
