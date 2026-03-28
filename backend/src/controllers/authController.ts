/**
 * Auth Controller
 * Handles authentication HTTP requests
 * @module controllers/authController
 */

import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { logger } from '../utils/logger';

/**
 * POST /auth/register
 * Register a new user account
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
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
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
