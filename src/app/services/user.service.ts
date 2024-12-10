import { inject, Injectable, signal } from '@angular/core';

import { Router } from '@angular/router';
import { Account, UrlsNames } from '../models/shared-models';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  router: Router = inject(Router);
  user = signal(new Account());
  isLoading = signal(false);
  constructor() {}
  submitLogin(e: any) {
    this.isLoading.set(true);
    this.router.navigate(['/', UrlsNames.ADMIN]);
  }
  logout() {
    this.router.navigate(['/']);
  }
}
