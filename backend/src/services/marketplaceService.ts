/**
 * Marketplace Service
 * Handles direct farmer-to-buyer crop marketplace operations
 * @module services/marketplaceService
 */

import { getPrismaClient } from '../config/database';
import { logger } from '../utils/logger';
import { AppError, NotFoundError, ValidationError } from '../middleware/errorHandler';

export interface CreateListingInput {
  cropId: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  imageUrls?: string[];
}

export interface UpdateListingInput {
  quantity?: number;
  unit?: string;
  pricePerUnit?: number;
  location?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  imageUrls?: string[];
  status?: 'active' | 'sold' | 'expired';
}

export interface ListingFilters {
  region?: string;
  cropId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'sold' | 'expired';
  page?: number;
  limit?: number;
}

/**
 * Create a new marketplace listing
 * @param sellerId - ID of the farmer selling
 * @param input - Listing details
 * @returns Created listing
 */
export async function createListing(
  sellerId: string,
  input: CreateListingInput
) {
  const prisma = getPrismaClient();

  // Verify crop exists
  const crop = await prisma.crop.findUnique({
    where: { id: input.cropId },
  });

  if (!crop) {
    throw new ValidationError('Invalid crop ID');
  }

  // Set expiration to 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  let listing;
  try {
    listing = await prisma.marketplaceListing.create({
      data: {
        sellerId,
        cropId: input.cropId,
        quantity: input.quantity,
        unit: input.unit,
        pricePerUnit: input.pricePerUnit,
        location: input.location,
        description: input.description,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        imageUrls: input.imageUrls || [],
        status: 'active',
        expiresAt,
      },
      include: {
        crop: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            region: true,
          },
        },
      },
    });
  } catch (error) {
    logger.error({ error, sellerId, cropId: input.cropId }, 'Create listing DB error');
    throw error;
  }

  logger.info(
    { listingId: listing.id, sellerId, crop: input.cropId },
    'Marketplace listing created'
  );

  return listing;
}

/**
 * Get marketplace listings with filters
 * @param filters - Query filters
 * @returns Paginated listings
 */
export async function getListings(filters: ListingFilters) {
  const prisma = getPrismaClient();

  const {
    region,
    cropId,
    minPrice,
    maxPrice,
    status = 'active',
    page = 1,
    limit = 20,
  } = filters;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, any> = {
    status: status,
  };

  if (region) {
    where.location = { contains: region, mode: 'insensitive' };
  }

  if (cropId) {
    where.cropId = cropId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerUnit = {};
    if (minPrice !== undefined) where.pricePerUnit.gte = minPrice;
    if (maxPrice !== undefined) where.pricePerUnit.lte = maxPrice;
  }

  // Fetch listings and total count
  let listings, total;
  try {
    [listings, total] = await Promise.all([
      prisma.marketplaceListing.findMany({
        where,
        include: {
          crop: {
            select: { id: true, name: true, nameUrdu: true, namePunjabi: true },
          },
          seller: {
            select: {
              id: true,
              name: true,
              region: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.marketplaceListing.count({ where }),
    ]);
  } catch (error) {
    logger.error({ error, filters }, 'Get listings DB query failed');
    throw error;
  }

  logger.debug(
    { filters, total, returned: listings.length },
    'Marketplace listings retrieved'
  );

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single marketplace listing by ID
 * @param id - Listing ID
 * @returns Listing details
 */
export async function getListingById(id: string) {
  const prisma = getPrismaClient();

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: {
      crop: true,
      seller: {
        select: {
          id: true,
          name: true,
          region: true,
        },
      },
      offers: {
        select: {
          id: true,
          offerPrice: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  return listing;
}

/**
 * Update a marketplace listing (owner only)
 * @param id - Listing ID
 * @param sellerId - ID of the seller (ownership check)
 * @param input - Updated fields
 * @returns Updated listing
 */
export async function updateListing(
  id: string,
  sellerId: string,
  input: UpdateListingInput
) {
  const prisma = getPrismaClient();

  // Check ownership
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
  });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  if (listing.sellerId !== sellerId) {
    throw new AppError('Unauthorized: You can only edit your own listings', 403);
  }

  let updated;
  try {
    updated = await prisma.marketplaceListing.update({
      where: { id },
      data: input,
      include: {
        crop: true,
        seller: {
          select: {
            id: true,
            name: true,
            region: true,
          },
        },
      },
    });
  } catch (error) {
    logger.error({ error, listingId: id, sellerId }, 'Update listing DB error');
    throw error;
  }

  logger.info({ listingId: id, sellerId }, 'Marketplace listing updated');

  return updated;
}

/**
 * Delete a marketplace listing (soft delete by setting status to 'expired')
 * @param id - Listing ID
 * @param sellerId - ID of the seller (ownership check)
 */
export async function deleteListing(
  id: string,
  sellerId: string
): Promise<void> {
  const prisma = getPrismaClient();

  // Check ownership
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
  });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  if (listing.sellerId !== sellerId) {
    throw new AppError('Unauthorized: You can only delete your own listings', 403);
  }

  // Soft delete by setting status to 'expired'
  await prisma.marketplaceListing.update({
    where: { id },
    data: { status: 'expired' },
  });

  logger.info({ listingId: id, sellerId }, 'Marketplace listing deleted');
}

/**
 * Reveal seller contact information to a buyer
 * Only returns phone/email if listing is active
 * @param listingId - Listing ID
 * @param buyerId - ID of the buyer requesting contact
 * @returns Contact information
 */
export async function revealContact(listingId: string, buyerId: string) {
  const prisma = getPrismaClient();

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  if (listing.status !== 'active') {
    throw new AppError('Cannot contact seller: Listing is no longer active', 400);
  }

  logger.info(
    { listingId, buyerId, sellerId: listing.sellerId },
    'Seller contact revealed to buyer'
  );

  return {
    sellerName: listing.seller.name,
    contactPhone: listing.contactPhone,
    contactEmail: listing.contactEmail,
  };
}
