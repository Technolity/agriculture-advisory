/**
 * Disease Detection Routes
 * @module routes/disease
 */

import { Router } from 'express';
import multer from 'multer';
import { detect, getHistory } from '../controllers/diseaseController';
import { authenticate } from '../middleware/auth';
import { uploadRateLimiter } from '../middleware/rateLimit';
import { MAX_IMAGE_SIZE_KB } from '../utils/constants';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_KB * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

const router = Router();

/** GET /diseases/history - Fetch recent detections for the authenticated user */
router.get('/history', authenticate, getHistory);

/** POST /diseases/detect - Upload image for disease detection */
router.post('/detect', authenticate, uploadRateLimiter, upload.single('image'), detect);

export default router;
