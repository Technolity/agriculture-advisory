/**
 * Disease Mapping
 * Maps TFLite classification IDs to disease records
 * @module utils/diseaseMapping
 */

/** Disease class mapping for TFLite model */
export const DISEASE_CLASS_MAP: Record<number, {
  name: string;
  nameUrdu: string;
  severity: string;
  treatment: string;
  treatmentUrdu: string;
}> = {
  0: {
    name: 'Healthy',
    nameUrdu: 'صحت مند',
    severity: 'low',
    treatment: 'No treatment needed. Plant is healthy.',
    treatmentUrdu: 'کسی علاج کی ضرورت نہیں۔ پودا صحت مند ہے۔',
  },
  1: {
    name: 'Late Blight',
    nameUrdu: 'دیر سے جھلسا',
    severity: 'high',
    treatment: 'Apply copper-based fungicide. Remove infected leaves. Ensure good air circulation.',
    treatmentUrdu: 'تانبے پر مبنی پھپھوندی کش لگائیں۔ متاثرہ پتے ہٹائیں۔',
  },
  2: {
    name: 'Early Blight',
    nameUrdu: 'ابتدائی جھلسا',
    severity: 'medium',
    treatment: 'Apply mancozeb fungicide. Practice crop rotation. Remove debris.',
    treatmentUrdu: 'مینکوزیب پھپھوندی کش لگائیں۔ فصل کی گردش کریں۔',
  },
  3: {
    name: 'Powdery Mildew',
    nameUrdu: 'سفید پاؤڈر پھپھوندی',
    severity: 'medium',
    treatment: 'Apply sulfur-based fungicide. Improve air circulation. Reduce humidity.',
    treatmentUrdu: 'گندھک پر مبنی پھپھوندی کش لگائیں۔',
  },
  4: {
    name: 'Leaf Spot',
    nameUrdu: 'پتوں کے دھبے',
    severity: 'low',
    treatment: 'Remove affected leaves. Apply neem oil. Avoid overhead watering.',
    treatmentUrdu: 'متاثرہ پتے ہٹائیں۔ نیم کا تیل لگائیں۔',
  },
};

/**
 * Get disease info by TFLite class ID
 */
export function getDiseaseByClassId(classId: number) {
  return DISEASE_CLASS_MAP[classId] || null;
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
    critical: '#9C27B0',
  };
  return colors[severity] || '#9E9E9E';
}
