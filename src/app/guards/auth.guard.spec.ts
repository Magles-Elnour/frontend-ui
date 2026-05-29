import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { UserService } from '../services/user.service';
import { UserRole } from '../models/shared-models';

describe('authGuard', () => {
  let userService: { accessToken: jasmine.Spy; user: jasmine.Spy };

  const runGuard = (route: ActivatedRouteSnapshot) =>
    TestBed.runInInjectionContext(() =>
      (authGuard as CanActivateFn)(route, {} as never)
    );

  const routeWith = (expectedRoles?: UserRole[]) =>
    ({ data: { expectedRoles } } as unknown as ActivatedRouteSnapshot);

  beforeEach(() => {
    userService = {
      accessToken: jasmine.createSpy('accessToken'),
      user: jasmine.createSpy('user'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userService as unknown as UserService },
      ],
    });
  });

  it('redirects to / when there is no access token', () => {
    userService.accessToken.and.returnValue(null);

    const result = runGuard(routeWith());

    expect(result).toBeInstanceOf(UrlTree);
  });

  it('allows access when authenticated and no roles are required', () => {
    userService.accessToken.and.returnValue('token');

    expect(runGuard(routeWith())).toBeTrue();
  });

  it('allows access when the user has an expected role', () => {
    userService.accessToken.and.returnValue('token');
    userService.user.and.returnValue({ role: UserRole.ADMIN });

    expect(runGuard(routeWith([UserRole.ADMIN]))).toBeTrue();
  });

  it('redirects when the user lacks the expected role', () => {
    userService.accessToken.and.returnValue('token');
    userService.user.and.returnValue({ role: UserRole.USER });

    const result = runGuard(routeWith([UserRole.ADMIN]));

    expect(result).toBeInstanceOf(UrlTree);
  });
});
