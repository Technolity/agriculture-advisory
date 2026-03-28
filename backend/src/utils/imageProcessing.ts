/**
 * Image Processing Utilities
 * Handles image compression, hashing, and validation
 * @module utils/imageProcessing
 */

import crypto from 'crypto';
import { logger } from './logger';
import { MAX_IMAGE_SIZE_KB } from './constants';

/**
 * Generate SHA256 hash of image buffer for deduplication
 * Edge case #6: Prevents duplicate image submissions
 * @param imageBuffer - Raw image buffer
 * @returns SHA256 hash string
 */
export function generateImageHash(imageBuffer: Buffer): string {
  return crypto.createHash('sha256').update(imageBuffer).digest('hex');
}

/**
 * Validate image size against maximum allowed
 * Edge case #4: Handles large image uploads
 * @param sizeInBytes - Image file size in bytes
 * @returns Whether image is within size limits
 */
export function validateImageSize(sizeInBytes: number): boolean {
  const maxSizeBytes = MAX_IMAGE_SIZE_KB * 1024;
  if (sizeInBytes > maxSizeBytes) {
    logger.warn({ sizeInBytes, maxSizeBytes }, 'Image exceeds maximum allowed size');
    return false;
  }
  return true;
}

/**
 * Validate image MIME type
 * @param mimeType - File MIME type
 * @returns Whether MIME type is allowed
 */
export function validateImageType(mimeType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(mimeType);
}

/**
 * Placeholder: Compress image to target size
 * TODO: Implement actual image compression (e.g., using sharp)
 * @param imageBuffer - Raw image buffer
 * @param targetSizeKB - Target size in KB
 * @returns Compressed image buffer
 */
export async function compressImage(
  imageBuffer: Buffer,
  targetSizeKB: number = MAX_IMAGE_SIZE_KB
): Promise<Buffer> {
  // TODO: Implement using sharp library
  // For now, return original buffer
  logger.info({ originalSize: imageBuffer.length, targetSizeKB }, 'Image compression requested (placeholder)');
  return imageBuffer;
}

/**
 * Convert base64 string to Buffer
 * @param base64String - Base64 encoded image string
 * @returns Image buffer
 */
export function base64ToBuffer(base64String: string): Buffer {
  // Remove data URI prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}
