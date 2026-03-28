/**
 * Health Routes
 * @module routes/health
 */

import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const router = Router();

/** GET /health - System health check */
router.get('/', healthCheck);

export default router;
