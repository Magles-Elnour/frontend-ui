import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class authGuard {
  constructor(public userService: UserService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['expectedRoles'];
    if (false) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
// !this.userService.user()
// !this.userService
//         .user()?.metadata['roles']?.some((role: string) => expectedRoles.includes(role))
