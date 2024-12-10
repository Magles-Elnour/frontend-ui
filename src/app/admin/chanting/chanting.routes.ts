import { Route } from '@angular/router';
import { authGuard } from '../../gurds/auth.guard';
import { UrlsNames, UserRoles } from '../../models/shared-models';

export default [
  { path: '', redirectTo: UrlsNames.CHANTING_LIST, pathMatch: 'full' },
  {
    path: UrlsNames.CHANTING_LIST,
    loadComponent: () =>
      import('./components/chanting-list/chanting-list.component').then(
        (m) => m.ChantingListComponent
      ),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRoles.ADMIN] },
  },
  {
    path: UrlsNames.CHANTING_ATTENDANCE,
    loadComponent: () =>
      import(
        './components/chanting-attendance/chanting-attendance.component'
      ).then((m) => m.ChantingAttendanceComponent),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRoles.ADMIN] },
  },
] satisfies Route[];
