import { Route } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { UrlsNames, UserRole } from '../../models/shared-models';

export default [
  { path: '', redirectTo: UrlsNames.MEMBERS_LIST, pathMatch: 'full' },
  {
    path: UrlsNames.MEMBERS_LIST,
    loadComponent: () =>
      import('./components/members-list/members-list.component').then(
        (m) => m.MembersListComponent
      ),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
  },
  {
    path: UrlsNames.MEMBERS_ATTENDANCE,
    loadComponent: () =>
      import(
        './components/members-attendance/members-attendance.component'
      ).then((m) => m.MembersAttendanceComponent),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
  },
  {
    path: UrlsNames.MEMBERS_ADD,
    loadComponent: () =>
      import('./components/members-form/members-form.component').then(
        (m) => m.MembersFormComponent
      ),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
  },
  {
    path: `${UrlsNames.MEMBERS_EDIT}/:id`,
    loadComponent: () =>
      import('./components/members-form/members-form.component').then(
        (m) => m.MembersFormComponent
      ),
    canActivate: [authGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
  },
] satisfies Route[];
