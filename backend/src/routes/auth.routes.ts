/**
 * Auth Routes
 * @module routes/auth
 */

import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateBody } from '../middleware/validator';
import { registerSchema, loginSchema } from '../utils/validators';
import { authRateLimiter } from '../middleware/rateLimit';

const router = Router();

/** POST /auth/register - Register a new user */
router.post('/register', authRateLimiter, validateBody(registerSchema), register);

/** POST /auth/login - Login with credentials */
router.post('/login', authRateLimiter, validateBody(loginSchema), login);

export default router;
