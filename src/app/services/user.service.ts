import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { Account, UrlsNames, UserRole } from '../models/shared-models';
import { MOCK_AUTH_ENABLED } from '../core/auth/auth.config';

const MOCK_SESSION_KEY = 'mock-auth-username';

interface AuthResponse {
  accessToken: string;
}

interface UserProfile {
  id: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly mockAuthEnabled = inject(MOCK_AUTH_ENABLED);

  user = signal<Account | null>(null);
  accessToken = signal<string | null>(null);
  isLoading = signal(false);

  signIn(username: string, password: string): Observable<void> {
    if (this.mockAuthEnabled) {
      sessionStorage.setItem(MOCK_SESSION_KEY, username);
      this.setMockSession(username);
      this.router.navigate(['/', UrlsNames.ADMIN]);
      return of(void 0);
    }

    this.isLoading.set(true);
    return this.http
      .post<AuthResponse>('/api/auth/sign-in', { username, password })
      .pipe(
        tap((res) => this.accessToken.set(res.accessToken)),
        switchMap(() => this.fetchCurrentUser()),
        tap(() => this.router.navigate(['/', UrlsNames.ADMIN])),
        map(() => void 0),
        finalize(() => this.isLoading.set(false))
      );
  }

  refreshToken(): Observable<void> {
    if (this.mockAuthEnabled) return of(void 0);

    return this.http.post<AuthResponse>('/api/auth/refresh', {}).pipe(
      tap((res) => this.accessToken.set(res.accessToken)),
      map(() => void 0)
    );
  }

  /**
   * Restores the session on app startup. The access token lives only in memory and is
   * lost on a full page reload, but the refresh token is an HttpOnly cookie that
   * survives. This exchanges that cookie for a fresh access token + user profile so a
   * refresh doesn't log the user out. Never errors: if there's no valid cookie the
   * session simply stays cleared.
   */
  initSession(): Observable<void> {
    if (this.mockAuthEnabled) {
      const username = sessionStorage.getItem(MOCK_SESSION_KEY);
      if (username) this.setMockSession(username);
      return of(void 0);
    }

    return this.http.post<AuthResponse>('/api/auth/refresh', {}).pipe(
      tap((res) => this.accessToken.set(res.accessToken)),
      switchMap(() => this.fetchCurrentUser()),
      catchError(() => {
        this.accessToken.set(null);
        this.user.set(null);
        return of(void 0);
      })
    );
  }

  signOut(): void {
    if (this.mockAuthEnabled) {
      this.clearSession();
      return;
    }

    this.http.post('/api/auth/sign-out', {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  clearSession(): void {
    if (this.mockAuthEnabled) sessionStorage.removeItem(MOCK_SESSION_KEY);
    this.accessToken.set(null);
    this.user.set(null);
    this.router.navigate(['/']);
  }

  private setMockSession(username: string): void {
    this.accessToken.set('mock-access-token');
    this.user.set({ id: 'mock-admin', username, role: UserRole.ADMIN });
  }

  private fetchCurrentUser(): Observable<void> {
    return this.http.get<UserProfile>('/api/users/me').pipe(
      tap((profile) => {
        const role = this.decodeTokenRole();
        this.user.set({ id: profile.id, username: profile.username, role });
      }),
      map(() => void 0)
    );
  }

  private decodeTokenRole(): UserRole | undefined {
    const token = this.accessToken();
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] as UserRole;
    } catch {
      return undefined;
    }
  }
}
