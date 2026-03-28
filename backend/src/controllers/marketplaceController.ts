/**
 * Marketplace Controller
 * Handles HTTP requests for crop marketplace endpoints
 * @module controllers/marketplaceController
 */

import { Request, Response, NextFunction } from 'express';
import * as marketplaceService from '../services/marketplaceService';
import { logger } from '../utils/logger';

/**
 * Create a new marketplace listing
 * POST /api/marketplace/listings
 * Requires authentication
 */
export async function createListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    logger.info({ userId, route: req.path, cropId: req.body?.cropId }, 'Create listing attempt');
    const listing = await marketplaceService.createListing(userId, req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

/**
 * Get marketplace listings with filters
 * GET /api/marketplace/listings
 * Optional authentication
 */
export async function getListings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = (req.query.status as string) || 'active';
    const filters: marketplaceService.ListingFilters = {
      region: req.query.region as string | undefined,
      cropId: req.query.cropId as string | undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      status: (status as 'active' | 'sold' | 'expired') || 'active',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    logger.info({ route: req.path, filters }, 'Get listings request');
    const result = await marketplaceService.getListings(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single marketplace listing
 * GET /api/marketplace/listings/:id
 * Optional authentication
 */
export async function getListingById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    logger.info({ route: req.path, listingId: id }, 'Get listing by ID request');
    const listing = await marketplaceService.getListingById(id);
    res.json(listing);
  } catch (error) {
    next(error);
  }
}

/**
 * Update a marketplace listing
 * PUT /api/marketplace/listings/:id
 * Requires authentication + ownership
 */
export async function updateListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    logger.info({ userId, route: req.path, listingId: id }, 'Update listing attempt');
    const updated = await marketplaceService.updateListing(id, userId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a marketplace listing
 * DELETE /api/marketplace/listings/:id
 * Requires authentication + ownership
 */
export async function deleteListing(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    logger.info({ userId, route: req.path, listingId: id }, 'Delete listing attempt');
    await marketplaceService.deleteListing(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Reveal seller contact information
 * POST /api/marketplace/listings/:id/contact
 * Requires authentication
 */
export async function contactSeller(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    logger.info({ userId, route: req.path, listingId: id }, 'Contact seller reveal attempt');
    const contact = await marketplaceService.revealContact(id, userId);
    res.json(contact);
  } catch (error) {
    next(error);
  }
}
