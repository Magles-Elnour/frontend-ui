import { Route } from '@angular/router';
import { UrlsNames } from '../models/shared-models';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./side-nave.component').then((c) => c.SideNaveComponent),
    children: [
      { path: '', redirectTo: UrlsNames.MEMBERS, pathMatch: 'full' },
      {
        path: UrlsNames.MEMBERS,
        loadChildren: () => import('./members/members.routes'),
      },
      {
        path: UrlsNames.CHANTING,
        loadChildren: () => import('./chanting/chanting.routes'),
      },
      {
        path: UrlsNames.COUNCIL_PROGRAM,
        loadChildren: () => import('./chanting/chanting.routes'),
      },
      {
        path: UrlsNames.REPORTS,
        loadChildren: () => import('./chanting/chanting.routes'),
      },
      {
        path: UrlsNames.MANAGERS,
        loadChildren: () => import('./chanting/chanting.routes'),
      },
    ],
  },
] satisfies Route[];
