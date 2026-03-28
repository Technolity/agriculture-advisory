/**
 * OpenAI API Client Configuration
 * Used for disease detection via GPT-4 Vision
 * @module config/claudeClient
 */

import OpenAI from 'openai';
import { env } from './env';
import { logger } from '../utils/logger';

let openaiClient: OpenAI | null = null;

/**
 * Initialize OpenAI client
 * Returns null if API key is not configured
 */
export function initClaudeClient(): OpenAI | null {
  if (!env.OPENAI_API_KEY) {
    logger.warn('OPENAI_API_KEY not set - disease detection via AI will be unavailable');
    return null;
  }

  openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  logger.info('OpenAI client initialized');
  return openaiClient;
}

/**
 * Get the OpenAI client instance
 */
export function getClaudeClient(): OpenAI | null {
  return openaiClient;
}

/**
 * Analyze image for crop disease detection using GPT-4 Vision
 * @param imageBase64 - Base64 encoded image
 * @param cropName - Name of the crop for context
 * @returns Disease classification result
 */
export async function analyzeImage(
  imageBase64: string,
  cropName?: string
): Promise<{ disease: string; confidence: number; treatment: string } | null> {
  if (!openaiClient) {
    logger.warn('OpenAI client not available - skipping AI analysis');
    return null;
  }

  try {
    const prompt = cropName
      ? `You are an expert agricultural pathologist. Analyze this image of a ${cropName} plant and identify any crop disease. Return a JSON object with fields: disease (string), confidence (0-1 float), treatment (string). If no disease is detected, return disease: "Healthy".`
      : `You are an expert agricultural pathologist. Analyze this crop image and identify any disease. Return a JSON object with fields: disease (string), confidence (0-1 float), treatment (string). If no disease is detected, return disease: "Healthy".`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const result = JSON.parse(content);
    logger.info({ cropName, disease: result.disease, confidence: result.confidence }, 'AI disease analysis complete');
    return result;
  } catch (error) {
    logger.error({ error }, 'OpenAI image analysis failed');
    return null;
  }
}

export default { initClaudeClient, getClaudeClient, analyzeImage };
