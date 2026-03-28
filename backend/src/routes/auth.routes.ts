/**
 * Auth Routes
 * @module routes/auth
 */

import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { validateBody } from '../middleware/validator';
import { registerSchema, loginSchema } from '../utils/validators';
import { authRateLimiter } from '../middleware/rateLimit';
import { authenticate } from '../middleware/auth';

const router = Router();

/** POST /auth/register - Register a new user */
router.post('/register', authRateLimiter, validateBody(registerSchema), register);

/** POST /auth/login - Login with credentials */
router.post('/login', authRateLimiter, validateBody(loginSchema), login);

/** GET /auth/me - Get authenticated user's profile */
router.get('/me', authenticate, getProfile);

export default router;
