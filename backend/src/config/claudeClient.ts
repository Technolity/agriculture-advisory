/**
 * OpenAI API Client Configuration
 * Used for crop disease detection and plant identification via GPT-4o Vision
 * @module config/claudeClient
 */

import OpenAI from 'openai';
import { env } from './env';
import { logger } from '../utils/logger';

let openaiClient: OpenAI | null = null;

export interface AIAnalysisResult {
  plant_identified: string;
  is_healthy: boolean;
  disease: string;
  confidence: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'NONE';
  symptoms: string[];
  treatment_steps: string[];
  prevention_tips: string[];
  urgency: 'immediate' | 'within_week' | 'routine' | 'none';
  additional_notes: string;
}

export function initClaudeClient(): OpenAI | null {
  if (!env.OPENAI_API_KEY) {
    logger.warn('OPENAI_API_KEY not set - disease detection via AI will be unavailable');
    return null;
  }

  openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  logger.info('OpenAI client initialized');
  return openaiClient;
}

export function getClaudeClient(): OpenAI | null {
  return openaiClient;
}

const SYSTEM_PROMPT = `You are an expert agricultural pathologist and agronomist specializing in South Asian crops, particularly those grown in Kashmir, Punjab (Pakistan/India), Sindh, and surrounding regions.

Your deep expertise covers:

CROPS: Wheat (گندم), Rice/Paddy (چاول), Maize/Corn (مکئی), Cotton (کپاس), Mustard (سرسوں), Potato (آلو), Tomato (ٹماٹر), Onion (پیاز), Chili/Pepper (مرچ), Apple (سیب), Pear (ناشپاتی), Cherry (چیری), Saffron (زعفران), Walnut (اخروٹ), Pea (مٹر), Cucumber (کھیرا), Sugarcane (گنا), Sunflower (سورج مکھی)

COMMON DISEASES BY CROP:
- Wheat: Rust (Yellow/Brown/Black), Powdery Mildew, Loose Smut, Karnal Bunt, Septoria Leaf Blotch
- Rice: Blast, Brown Spot, Bacterial Leaf Blight, Sheath Blight, False Smut
- Tomato: Early Blight, Late Blight, Bacterial Wilt, Tomato Mosaic Virus, Leaf Curl, Fusarium Wilt
- Potato: Late Blight (Phytophthora), Early Blight, Black Scurf, Common Scab, Bacterial Soft Rot
- Cotton: Cotton Leaf Curl Virus (CLCuV), Bacterial Blight, Alternaria Leaf Spot, Root Rot
- Maize: Northern Corn Leaf Blight, Gray Leaf Spot, Ear Rot, Stalk Rot
- Chili: Anthracnose, Phytophthora Blight, Bacterial Spot, Chili Mosaic Virus
- Apple/Pear: Fire Blight, Powdery Mildew, Scab, Canker, Brown Rot
- General: Nutrient deficiencies (Nitrogen/Iron/Zinc/Boron), drought stress, waterlogging

SEVERITY CLASSIFICATION:
- HIGH: Disease is spreading rapidly, >30% leaf area affected, will cause significant yield loss if untreated immediately
- MEDIUM: Moderate infection, 10-30% affected, needs treatment within 7 days
- LOW: Early stage, <10% affected, preventive treatment sufficient
- NONE: Plant is healthy

URGENCY CLASSIFICATION:
- immediate: Treat within 24-48 hours or lose the crop
- within_week: Treat within 7 days
- routine: Preventive care, treat within 2-4 weeks
- none: Plant is healthy, no treatment needed

TREATMENT KNOWLEDGE:
- Use pesticide/fungicide names available in Pakistan and India (Mancozeb, Metalaxyl, Carbendazim, Chlorothalonil, Copper Oxychloride, Imidacloprid, Deltamethrin, etc.)
- Include both chemical and organic/traditional treatment options where possible
- Specify concentrations (e.g., "2g per litre of water")
- Include timing (morning spray recommended, avoid heat of day)
- Mention if the disease is weather-dependent (humidity, temperature triggers)

CLIMATE CONTEXT:
Kashmir has cold winters, warm summers, monsoon rainfall June-September. Humidity-related fungal diseases peak July-September. Punjab has hot dry summers, mild winters, cotton/wheat belt. Sindh has arid climate, irrigation-dependent.

Always respond in valid JSON only. No markdown, no code blocks, just the JSON object.`;

const ANALYSIS_SCHEMA = `Analyze the image and return ONLY a valid JSON object with exactly these fields:
{
  "plant_identified": "exact crop/plant name visible in the image (e.g. Tomato, Wheat, Rice, Apple, Unknown)",
  "is_healthy": true or false,
  "disease": "exact disease name, or 'Healthy' if no disease, or 'Unknown Condition' if unclear",
  "confidence": 0.0 to 1.0 (your confidence in the diagnosis),
  "severity": "NONE" | "LOW" | "MEDIUM" | "HIGH",
  "symptoms": ["symptom 1 observed", "symptom 2 observed", "symptom 3 observed"],
  "treatment_steps": ["Step 1: specific action with product/dose", "Step 2: ...", "Step 3: ...", "Step 4: ..."],
  "prevention_tips": ["tip 1", "tip 2", "tip 3"],
  "urgency": "immediate" | "within_week" | "routine" | "none",
  "additional_notes": "any additional observations about the plant health, growth stage, environmental stress, or local context"
}

If the image does not show a plant or crop at all, set plant_identified to "Not a plant image" and is_healthy to true with severity NONE.
If you can see a plant but cannot confidently identify a specific disease, make your best assessment and set confidence accordingly.
Return ONLY the JSON object, no other text.`;

/**
 * Analyze a crop image using GPT-4o Vision.
 * Returns rich agricultural diagnosis including plant ID, symptoms, treatment, and prevention.
 */
export async function analyzeImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  cropName?: string
): Promise<AIAnalysisResult | null> {
  if (!openaiClient) {
    logger.warn('OpenAI client not available - skipping AI analysis');
    return null;
  }

  const userPrompt = cropName
    ? `This is an image of a ${cropName} crop/plant from South Asia (likely Kashmir or Punjab region). ${ANALYSIS_SCHEMA}`
    : `Analyze this crop/plant image from South Asia. ${ANALYSIS_SCHEMA}`;

  // Ensure correct data URL MIME type
  const supportedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const safeMime = supportedMimes.includes(mimeType) ? mimeType : 'image/jpeg';

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${safeMime};base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1200,
      temperature: 0.2, // Low temperature for consistent, factual analysis
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      logger.warn('OpenAI returned empty content');
      return null;
    }

    let result: AIAnalysisResult;
    try {
      result = JSON.parse(content) as AIAnalysisResult;
    } catch (parseError) {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]) as AIAnalysisResult;
      } else {
        logger.error({ content, parseError }, 'Failed to parse AI JSON response');
        return null;
      }
    }

    // Normalize fields
    result.confidence = Math.min(1, Math.max(0, result.confidence ?? 0));
    result.severity = (['LOW', 'MEDIUM', 'HIGH', 'NONE'].includes(result.severity)
      ? result.severity
      : 'LOW') as AIAnalysisResult['severity'];
    result.urgency = (['immediate', 'within_week', 'routine', 'none'].includes(result.urgency)
      ? result.urgency
      : 'routine') as AIAnalysisResult['urgency'];
    result.symptoms = Array.isArray(result.symptoms) ? result.symptoms : [];
    result.treatment_steps = Array.isArray(result.treatment_steps) ? result.treatment_steps : [];
    result.prevention_tips = Array.isArray(result.prevention_tips) ? result.prevention_tips : [];

    logger.info(
      {
        plant: result.plant_identified,
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        urgency: result.urgency,
        cropHint: cropName,
      },
      'AI crop analysis complete'
    );

    return result;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error({ error: errMsg, cropName, mimeType }, 'OpenAI image analysis failed');
    return null;
  }
}

export default { initClaudeClient, getClaudeClient, analyzeImage };
