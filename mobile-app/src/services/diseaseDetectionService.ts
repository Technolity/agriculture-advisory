/**
 * Disease Detection Service
 * Handles image upload and disease classification requests
 * @module services/diseaseDetectionService
 */

import { apiClient } from './syncService';

/**
 * Send image for disease detection
 * Edge case #4: Image compressed to max 500KB before upload
 * @param imageUri - Local file URI
 * @param cropId - Optional crop ID for context
 */
export async function detectDisease(imageUri: string, cropId?: string): Promise<unknown> {
  try {
    // TODO: Implement image compression before upload (Edge case #4)
    // TODO: Convert URI to FormData for upload

    const formData = new FormData();
    // formData.append('image', { uri: imageUri, type: 'image/jpeg', name: 'capture.jpg' } as any);
    if (cropId) {
      formData.append('cropId', cropId);
    }

    // TODO: Send to API
    // const response = await apiClient.post('/diseases/detect', formData);
    // return response.data;

    console.log('[DiseaseService] Would detect disease for:', imageUri);
    return null;
  } catch (error) {
    console.error('[DiseaseService] Detection failed:', error);
    throw error;
  }
}

/**
 * Get diseases for a specific crop
 * @param cropId - Crop UUID
 */
export async function getDiseasesByCrop(cropId: string): Promise<unknown[]> {
  try {
    // TODO: Fetch from API or local cache
    console.log('[DiseaseService] Fetching diseases for crop:', cropId);
    return [];
  } catch (error) {
    console.error('[DiseaseService] Failed to fetch diseases:', error);
    return [];
  }
}

/**
 * Submit feedback on detection accuracy
 * @param detectionId - Detection record ID
 * @param isCorrect - Whether classification was correct
 */
export async function submitFeedback(detectionId: string, isCorrect: boolean): Promise<void> {
  try {
    console.log('[DiseaseService] Feedback submitted:', { detectionId, isCorrect });
  } catch (error) {
    console.error('[DiseaseService] Feedback failed:', error);
  }
}
