import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const isAuthEndpoint = req.url.includes('/api/auth/');
  const token = userService.accessToken();

  const authReq =
    !isAuthEndpoint && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isAuthEndpoint
      ) {
        return userService.refreshToken().pipe(
          switchMap(() => {
            const newToken = userService.accessToken();
            const retried = newToken
              ? req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })
              : req;
            return next(retried);
          }),
          catchError((refreshError) => {
            userService.clearSession();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
