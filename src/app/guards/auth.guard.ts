import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.accessToken()) {
    return router.createUrlTree(['/']);
  }

  const expectedRoles: string[] = route.data['expectedRoles'];
  if (expectedRoles?.length) {
    const userRole = userService.user()?.role;
    if (!userRole || !expectedRoles.includes(userRole)) {
      return router.createUrlTree(['/']);
    }
  }

  return true;
};
