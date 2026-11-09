const FIELD_ERROR_KEYS: Record<string, string> = {
  required: 'REQUIRED',
  phone: 'PHONE_INVALID',
  memberPhone: 'MEMBER_PHONE_INVALID',
  cycleDigits: 'CYCLE_DIGITS_ERROR',
  cycleNumberRequired: 'CYCLE_NUMBER_REQUIRED',
  cycleDateRequired: 'CYCLE_DATE_REQUIRED',
};

export function fieldErrorKey(kind: string): string {
  return FIELD_ERROR_KEYS[kind] ?? 'Invalid value';
}