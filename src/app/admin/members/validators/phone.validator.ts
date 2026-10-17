import { ValidationErrors } from '@angular/forms';
import { isValidPhoneNumber } from 'libphonenumber-js';

// Default region for numbers entered without an international "+" prefix.
const DEFAULT_REGION = 'EG';

/**
 * Validates a phone number with libphonenumber-js, mirroring the backend @ValidPhoneNumber.
 * Empty is valid (phone is optional). Returns { phone: true } when invalid so the template
 * can show an inline error.
 */
export function validatePhone(value: unknown): ValidationErrors | null {
  if (value === null || value === undefined || `${value}`.trim() === '') {
    return null;
  }
  try {
    return isValidPhoneNumber(`${value}`, DEFAULT_REGION) ? null : { phone: true };
  } catch {
    return { phone: true };
  }
}