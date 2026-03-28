/**
 * Marketplace Routes
 * Direct farmer-to-buyer crop marketplace endpoints
 * @module routes/marketplace
 */

import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validator';
import * as controller from '../controllers/marketplaceController';

const router = express.Router();

// Query validators
const listingQuerySchema = {
  region: 'string?',
  cropId: 'string?',
  minPrice: 'number?',
  maxPrice: 'number?',
  status: 'enum(active,sold,expired)?',
  page: 'number?',
  limit: 'number?',
};

// Body validators
const createListingSchema = {
  cropId: 'string!',
  quantity: 'number!',
  unit: 'enum(kg,quintal,ton,bags)!',
  pricePerUnit: 'number!',
  location: 'string!',
  description: 'string?',
  contactPhone: 'string?',
  contactEmail: 'string?',
  imageUrls: 'string[]?',
};

const updateListingSchema = {
  quantity: 'number?',
  unit: 'enum(kg,quintal,ton,bags)?',
  pricePerUnit: 'number?',
  location: 'string?',
  description: 'string?',
  contactPhone: 'string?',
  contactEmail: 'string?',
  imageUrls: 'string[]?',
  status: 'enum(active,sold,expired)?',
};

// Routes

/**
 * GET /api/marketplace/listings
 * Get listings with optional filters
 */
router.get('/', optionalAuth, controller.getListings);

/**
 * POST /api/marketplace/listings
 * Create a new listing (seller only)
 */
router.post('/', authenticate, controller.createListing);

/**
 * GET /api/marketplace/listings/:id
 * Get a single listing by ID
 */
router.get('/:id', optionalAuth, controller.getListingById);

/**
 * PUT /api/marketplace/listings/:id
 * Update a listing (owner only)
 */
router.put('/:id', authenticate, controller.updateListing);

/**
 * DELETE /api/marketplace/listings/:id
 * Delete a listing (owner only)
 */
router.delete('/:id', authenticate, controller.deleteListing);

/**
 * POST /api/marketplace/listings/:id/contact
 * Reveal seller contact information (buyer)
 */
router.post('/:id/contact', authenticate, controller.contactSeller);

export default router;
