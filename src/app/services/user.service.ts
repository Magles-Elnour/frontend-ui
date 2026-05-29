import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, Observable, switchMap, tap } from 'rxjs';
import { Account, UrlsNames, UserRole } from '../models/shared-models';

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

  user = signal<Account | null>(null);
  accessToken = signal<string | null>(null);
  isLoading = signal(false);

  signIn(username: string, password: string): Observable<void> {
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
    return this.http.post<AuthResponse>('/api/auth/refresh', {}).pipe(
      tap((res) => this.accessToken.set(res.accessToken)),
      map(() => void 0)
    );
  }

  signOut(): void {
    this.http.post('/api/auth/sign-out', {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.user.set(null);
    this.router.navigate(['/']);
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
