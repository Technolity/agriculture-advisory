/**
 * Sync Routes
 * @module routes/sync
 */

import { Router } from 'express';
import { processQueue } from '../controllers/syncController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validator';
import { syncQueueSchema } from '../utils/validators';

const router = Router();

/** POST /sync/queue - Process offline queue items */
router.post('/queue', authenticate, validateBody(syncQueueSchema), processQueue);

export default router;
