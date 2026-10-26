const FIELD_ERROR_KEYS: Record<string, string> = {
  required: 'REQUIRED',
  phone: 'PHONE_INVALID',
  memberPhone: 'MEMBER_PHONE_INVALID',
};

export function fieldErrorKey(kind: string): string {
  return FIELD_ERROR_KEYS[kind] ?? 'Invalid value';
}