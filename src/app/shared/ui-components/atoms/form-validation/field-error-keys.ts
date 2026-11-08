const FIELD_ERROR_KEYS: Record<string, string> = {
  required: 'REQUIRED',
  phone: 'PHONE_INVALID',
  memberPhone: 'MEMBER_PHONE_INVALID',
  cycleDigits: 'CYCLE_DIGITS_ERROR',
};

export function fieldErrorKey(kind: string): string {
  return FIELD_ERROR_KEYS[kind] ?? 'Invalid value';
}