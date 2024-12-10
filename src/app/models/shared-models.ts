export class Account {
  id?: string;
  name?: string | null;
  roles?: UserRoles[] | null;
}

export enum UrlsNames {
  FAMILIES = 'families',
  DASHBOARD = 'dashboard',
  ORPHANS = 'orphans',
  DISABILITIES = 'disabilities',
  POOR = 'poor',
  LOGIN = 'login',
  ADMIN = 'admin',
  ADD_ORPHANS_FAMILY = 'add-family',
  EDIT_ORPHANS_FAMILY = 'edit-family',
}
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}
