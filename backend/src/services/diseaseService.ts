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
    const cachedTreatment = existingDetection.disease.treatment;
    return {
      diseaseId: existingDetection.disease.id,
      diseaseName: existingDetection.disease.name,
      plantIdentified: 'Unknown',
      isHealthy: false,
      confidence: existingDetection.claudeConfidence || existingDetection.tfliteConfidence || 0,
      severity: existingDetection.disease.severityLevel,
      urgency: 'within_week',
      symptoms: [],
      treatmentSteps: cachedTreatment ? [cachedTreatment] : [],
      preventionTips: [],
      additionalNotes: 'Result from previous analysis of the same image.',
      treatment: cachedTreatment,
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
    mimeType,
    cropName
  );

  if (!aiResult) {
    logger.warn({ userId, cropId, mimeType, imageHash }, 'AI analysis failed to return result');
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
  let detection;
  try {
    detection = await prisma.diseaseDetection.create({
      data: {
        userId,
        cropId,
        diseaseId,
        imageHash,
        claudeConfidence: aiResult.confidence,
      },
      include: { disease: true },
    });
  } catch (error) {
    logger.error({ error, userId, cropId, imageHash }, 'Disease detection record creation failed');
    throw error;
  }

  logger.info(
    { userId, cropId, diseaseId, confidence: aiResult.confidence },
    'Disease detection completed'
  );

  const treatmentFromDb: string | undefined = disease?.treatment;
  const firstTreatmentStep = aiResult.treatment_steps?.[0] ?? 'Consult a local agronomist';

  // Return the result
  return {
    diseaseId,
    diseaseName: disease?.name || aiResult.disease,
    plantIdentified: aiResult.plant_identified,
    isHealthy: aiResult.is_healthy,
    confidence: aiResult.confidence,
    severity: disease?.severityLevel || aiResult.severity,
    urgency: aiResult.urgency,
    symptoms: aiResult.symptoms,
    treatmentSteps: aiResult.treatment_steps,
    preventionTips: aiResult.prevention_tips,
    additionalNotes: aiResult.additional_notes,
    treatment: treatmentFromDb || firstTreatmentStep,
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

  let diseases;
  try {
    diseases = await prisma.disease.findMany({
      where: { cropId },
      orderBy: { severityLevel: 'desc' },
    });
  } catch (error) {
    logger.error({ error, cropId }, 'Diseases by crop DB query failed');
    throw error;
  }

  return diseases;
}

/**
 * Get recent disease detection history for a user.
 * @param userId - Authenticated user ID
 * @param limit - Maximum number of records to return
 */
export async function getDetectionHistory(userId: string, limit = 10) {
  const prisma = getPrismaClient();

  const detections = await prisma.diseaseDetection.findMany({
    where: { userId },
    include: {
      crop: {
        select: { name: true },
      },
      disease: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return detections.map((detection) => ({
    id: detection.id,
    diseaseName: detection.disease?.name || 'Unknown disease',
    cropName: detection.crop?.name || 'Unknown crop',
    confidence: detection.claudeConfidence || detection.tfliteConfidence || 0,
    createdAt: detection.createdAt.toISOString(),
  }));
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
