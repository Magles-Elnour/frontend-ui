import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { defer, delay, of } from 'rxjs';
import { MOCK_API_ENABLED } from '../auth/auth.config';
import { MockApiService } from './mock-api.service';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!inject(MOCK_API_ENABLED)) return next(req);

  const url = new URL(req.urlWithParams, 'http://localhost');
  if (!url.pathname.startsWith('/api/')) return next(req);

  const mockApi = inject(MockApiService);
  return defer(() => of(mockApi.handle(req, url))).pipe(delay(150));
};
