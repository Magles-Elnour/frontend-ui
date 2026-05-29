import { Routes } from '@angular/router';
import { UrlsNames } from './models/shared-models';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: UrlsNames.ADMIN,
    loadChildren: () => import('./admin/admin.routes'),
    canActivate: [authGuard],
  },
];
