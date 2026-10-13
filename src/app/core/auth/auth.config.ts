import { inject, InjectionToken, isDevMode } from '@angular/core';

// Temporary local backend. Set to false once backend CORS is fixed.
const ENABLE_MOCK_BACKEND = true;

export const MOCK_API_ENABLED = new InjectionToken<boolean>('MOCK_API_ENABLED', {
  providedIn: 'root',
  factory: () => isDevMode() && ENABLE_MOCK_BACKEND,
});

export const MOCK_AUTH_ENABLED = new InjectionToken<boolean>('MOCK_AUTH_ENABLED', {
  providedIn: 'root',
  factory: () => inject(MOCK_API_ENABLED),
});
