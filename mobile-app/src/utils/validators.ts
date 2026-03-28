/**
 * Mobile Input Validators
 * Client-side validation for forms
 * @module utils/validators
 */

/** Validate email format */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/** Validate phone number (South Asian format) */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/** Validate password strength (min 8 chars) */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/** Validate name (min 2 chars, max 100) */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/** Validate coordinates */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180;
}

/** Validate image size (max 500KB) - Edge case #4 */
export function isValidImageSize(sizeBytes: number, maxKB: number = 500): boolean {
  return sizeBytes <= maxKB * 1024;
}

/** Sanitize input string */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
