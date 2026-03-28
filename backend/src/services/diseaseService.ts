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

  // Call OpenAI API for analysis
  const aiResult = await analyzeImage(
    imageBuffer.toString('base64'),
    cropName
  );

  if (!aiResult) {
    logger.warn({ userId, cropId }, 'AI analysis failed to return result');
    return null;
  }

  // Match AI result to disease in database
  let diseaseId: string | undefined;
  let disease: any = null;

  if (cropId && aiResult.disease) {
    // Try to find matching disease by name (case-insensitive) for the given crop
    disease = await prisma.disease.findFirst({
      where: {
        cropId,
        name: { contains: aiResult.disease, mode: 'insensitive' },
      },
    });
  }

  // If crop-specific search fails, try across all crops
  if (!disease && aiResult.disease) {
    disease = await prisma.disease.findFirst({
      where: {
        name: { contains: aiResult.disease, mode: 'insensitive' },
      },
    });
  }

  if (disease) {
    diseaseId = disease.id;
  }

  // Create detection record
  const detection = await prisma.diseaseDetection.create({
    data: {
      userId,
      cropId,
      diseaseId,
      imageHash,
      claudeConfidence: aiResult.confidence,
    },
    include: { disease: true },
  });

  logger.info(
    { userId, cropId, diseaseId, confidence: aiResult.confidence },
    'Disease detection completed'
  );

  // Return the result
  return {
    diseaseId: diseaseId,
    diseaseName: disease?.name || aiResult.disease,
    confidence: aiResult.confidence,
    severity: disease?.severityLevel || 'unknown',
    treatment: disease?.treatment || aiResult.treatment,
    treatmentUrdu: disease?.treatmentUrdu,
  };
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
