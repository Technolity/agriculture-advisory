/**
 * Crop Routes
 * @module routes/crops
 */

import { Router } from 'express';
import { getCrops, getCropDiseases } from '../controllers/cropController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

/** GET /crops - List all crops */
router.get('/', optionalAuth, getCrops);

/** GET /crops/:id/diseases - Get diseases for a crop */
router.get('/:id/diseases', optionalAuth, getCropDiseases);

export default router;
