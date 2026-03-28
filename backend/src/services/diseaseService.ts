/**
 * Disease Detection Service
 * Handles disease detection, image processing, and AI classification
 * @module services/diseaseService
 */

import { getPrismaClient } from '../config/database';
import { analyzeImage } from '../config/claudeClient';
import { generateImageHash, validateImageSize, validateImageType } from '../utils/imageProcessing';
import { logger } from '../utils/logger';
import { DiseaseDetectionResult } from '../types';
import { AppError, ValidationError } from '../middleware/errorHandler';

/**
 * Process disease detection from uploaded image
 * Edge case #6: Checks for duplicate images via SHA256 hash
 * @param userId - Authenticated user ID
 * @param imageBuffer - Raw image buffer
 * @param mimeType - Image MIME type
 * @param cropId - Optional crop ID for context
 * @returns Disease detection result
 */
export async function detectDisease(
  userId: string,
  imageBuffer: Buffer,
  mimeType: string,
  cropId?: string
): Promise<DiseaseDetectionResult | null> {
  const prisma = getPrismaClient();

  // Validate image - Edge case #4
  if (!validateImageSize(imageBuffer.length)) {
    throw new ValidationError('Image exceeds maximum allowed size of 500KB');
  }

  if (!validateImageType(mimeType)) {
    throw new ValidationError('Invalid image type. Allowed: JPEG, PNG, WebP');
  }

  // Check for duplicate - Edge case #6
  const imageHash = generateImageHash(imageBuffer);
  const existingDetection = await prisma.diseaseDetection.findFirst({
    where: { userId, imageHash },
    include: { disease: true },
    orderBy: { createdAt: 'desc' },
  });

  if (existingDetection && existingDetection.disease) {
    logger.info({ imageHash }, 'Returning cached detection for duplicate image');
    return {
      diseaseId: existingDetection.disease.id,
      diseaseName: existingDetection.disease.name,
      confidence: existingDetection.claudeConfidence || existingDetection.tfliteConfidence || 0,
      severity: existingDetection.disease.severityLevel,
      treatment: existingDetection.disease.treatment,
      treatmentUrdu: existingDetection.disease.treatmentUrdu || undefined,
    };
  }

  // Get crop name for AI context
  let cropName: string | undefined;
  if (cropId) {
    const crop = await prisma.crop.findUnique({ where: { id: cropId } });
    cropName = crop?.name;
  }

  // Call Claude API for analysis (placeholder)
  const aiResult = await analyzeImage(
    imageBuffer.toString('base64'),
    cropName
  );

  // TODO: Match AI result to disease in database
  // TODO: Store detection record
  // For now, log and return null
  logger.info({ userId, cropId, imageHash, aiResult }, 'Disease detection processed (placeholder)');

  // Create detection record
  await prisma.diseaseDetection.create({
    data: {
      userId,
      cropId,
      imageHash,
      claudeConfidence: aiResult?.confidence,
    },
  });

  return null;
}

/**
 * Get diseases for a specific crop
 * @param cropId - Crop ID
 * @returns List of diseases
 */
export async function getDiseasesByCrop(cropId: string) {
  const prisma = getPrismaClient();

  const diseases = await prisma.disease.findMany({
    where: { cropId },
    orderBy: { severityLevel: 'desc' },
  });

  return diseases;
}

/**
 * Submit user feedback on detection accuracy
 * @param detectionId - Detection record ID
 * @param isCorrect - Whether the detection was correct
 * @param feedback - Optional text feedback
 */
export async function submitFeedback(
  detectionId: string,
  isCorrect: boolean,
  feedback?: string
): Promise<void> {
  const prisma = getPrismaClient();

  await prisma.diseaseDetection.update({
    where: { id: detectionId },
    data: { isCorrect, userFeedback: feedback },
  });

  logger.info({ detectionId, isCorrect }, 'Detection feedback submitted');
}
