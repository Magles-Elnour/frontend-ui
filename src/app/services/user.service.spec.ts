import { HttpClient, provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MOCK_AUTH_ENABLED } from '../core/auth/auth.config';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { UserRole } from '../models/shared-models';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    sessionStorage.removeItem('mock-auth-username');
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: MOCK_AUTH_ENABLED, useValue: true },
      ],
    });
  });

  afterEach(() => {
    http.verify();
    sessionStorage.removeItem('mock-auth-username');
  });

  function createService(mockAuthEnabled = true): void {
    TestBed.overrideProvider(MOCK_AUTH_ENABLED, { useValue: mockAuthEnabled });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  }

  it('signs in as a local admin without contacting the backend', () => {
    createService();
    service.signIn('developer', 'anything').subscribe();

    expect(service.user()).toEqual({
      id: 'mock-admin', username: 'developer', role: UserRole.ADMIN,
    });
    expect(service.accessToken()).toBeTruthy();
    expect(service.isLoading()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'admin']);
    http.expectNone(() => true);
  });

  it('restores the local session after a reload without backend calls', () => {
    createService();
    service.signIn('developer', 'anything').subscribe();
    const reloadedService = TestBed.runInInjectionContext(() => new UserService());
    reloadedService.initSession().subscribe();

    expect(reloadedService.user()?.username).toBe('developer');
    expect(reloadedService.user()?.role).toBe(UserRole.ADMIN);
    expect(reloadedService.accessToken()).toBeTruthy();
    http.expectNone(() => true);
  });

  it('starts signed out when there is no saved local session', () => {
    createService();
    service.initSession().subscribe();

    expect(service.user()).toBeNull();
    expect(service.accessToken()).toBeNull();
    http.expectNone(() => true);
  });

  it('clears the local session on logout without a backend call', () => {
    createService();
    service.signIn('developer', 'anything').subscribe();
    service.signOut();
    service.initSession().subscribe();

    expect(service.user()).toBeNull();
    expect(service.accessToken()).toBeNull();
    expect(sessionStorage.getItem('mock-auth-username')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    http.expectNone(() => true);
  });

  it('does not send the fake token or attempt refresh on an API rejection', () => {
    createService();
    service.signIn('developer', 'anything').subscribe();
    const client = TestBed.inject(HttpClient);
    const onError = jasmine.createSpy('onError');
    client.get('/api/members').subscribe({ error: onError });
    const request = http.expectOne('/api/members');

    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(onError).toHaveBeenCalled();
    expect(service.user()?.username).toBe('developer');
    http.expectNone('/api/auth/refresh');
  });

  it('refreshes locally without contacting the backend', () => {
    createService();
    service.signIn('developer', 'anything').subscribe();
    service.refreshToken().subscribe();

    expect(service.user()?.username).toBe('developer');
    http.expectNone(() => true);
  });

  it('uses real authentication when mock mode is disabled', () => {
    createService(false);
    const token = `header.${btoa(JSON.stringify({ role: UserRole.USER }))}.signature`;
    service.signIn('real-user', 'real-password').subscribe();

    expect(service.isLoading()).toBeTrue();
    const signIn = http.expectOne('/api/auth/sign-in');
    expect(signIn.request.body).toEqual({
      username: 'real-user', password: 'real-password',
    });
    signIn.flush({ accessToken: token });
    const profile = http.expectOne('/api/users/me');
    expect(profile.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    profile.flush({ id: 'real-id', username: 'real-user' });

    expect(service.user()).toEqual({
      id: 'real-id', username: 'real-user', role: UserRole.USER,
    });
    expect(service.isLoading()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'admin']);
  });

  it('ignores a saved mock session when real authentication is enabled', () => {
    createService(false);
    sessionStorage.setItem('mock-auth-username', 'developer');
    service.initSession().subscribe();
    http.expectOne('/api/auth/refresh').flush({}, {
      status: 401, statusText: 'Unauthorized',
    });

    expect(service.user()).toBeNull();
    expect(service.accessToken()).toBeNull();
  });
});
