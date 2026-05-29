import { Route } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { UrlsNames, UserRole } from '../../models/shared-models';

export default [
  { path: '', redirectTo: UrlsNames.CHANTING_LIST, pathMatch: 'full' },
  {
    path: UrlsNames.CHANTING_LIST,
    loadComponent: () =>
      import('./components/chanting-list/chanting-list.component').then(
        (m) => m.ChantingListComponent
      ),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
  },
  {
    path: UrlsNames.CHANTING_ATTENDANCE,
    loadComponent: () =>
      import(
        './components/chanting-attendance/chanting-attendance.component'
      ).then((m) => m.ChantingAttendanceComponent),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
  },
] satisfies Route[];
