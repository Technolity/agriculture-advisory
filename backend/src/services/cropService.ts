/**
 * Crop Service
 * Handles crop data retrieval and filtering
 * @module services/cropService
 */

import { getPrismaClient } from '../config/database';
import { logger } from '../utils/logger';
import { CropFilter, PaginationParams } from '../types';

/**
 * List all crops with optional filtering
 * @param filters - Optional filter parameters
 * @param pagination - Pagination parameters
 * @returns Paginated crop list
 */
export async function listCrops(
  filters: CropFilter = {},
  pagination: PaginationParams = {}
) {
  const prisma = getPrismaClient();

  const { page = 1, limit = 20 } = pagination;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.region) {
    where.region = { contains: filters.region, mode: 'insensitive' };
  }

  if (filters.season) {
    where.season = filters.season;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { nameUrdu: { contains: filters.search, mode: 'insensitive' } },
      { namePunjabi: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [crops, total] = await Promise.all([
    prisma.crop.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { diseases: true },
        },
      },
    }),
    prisma.crop.count({ where }),
  ]);

  logger.debug({ filters, total }, 'Crops listed');

  return {
    crops,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Get a single crop by ID with its diseases
 * @param cropId - Crop UUID
 * @returns Crop with diseases
 */
export async function getCropById(cropId: string) {
  const prisma = getPrismaClient();

  const crop = await prisma.crop.findUnique({
    where: { id: cropId },
    include: {
      diseases: {
        orderBy: { severityLevel: 'desc' },
      },
      marketPrices: {
        orderBy: { lastUpdated: 'desc' },
        take: 5,
      },
    },
  });

  return crop;
}
