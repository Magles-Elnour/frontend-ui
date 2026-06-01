import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
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

/** Attaches the phone validator to a template-driven control via `appPhone`. */
@Directive({
  selector: '[appPhone][ngModel]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: PhoneValidatorDirective, multi: true },
  ],
})
export class PhoneValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return validatePhone(control.value);
  }
}
