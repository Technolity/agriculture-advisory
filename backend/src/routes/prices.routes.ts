/**
 * Market Price Routes
 * @module routes/prices
 */

import { Router } from 'express';
import { getPrices } from '../controllers/priceController';
import { validateQuery } from '../middleware/validator';
import { priceQuerySchema } from '../utils/validators';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/** GET /prices?region=Kashmir&crop_ids=id1,id2 - Get market prices */
router.get('/', optionalAuth, validateQuery(priceQuerySchema), getPrices);

export default router;
