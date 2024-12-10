export class Account {
  id?: string;
  name?: string | null;
  roles?: UserRoles[] | null;
}

export enum UrlsNames {
  ADMIN = 'admin',
  MEMBERS = 'members',
  MEMBERS_LIST = 'members_list',
  MEMBERS_ATTENDANCE = 'members_attendance',
  CHANTING = 'chanting',
  CHANTING_LIST = 'chanting_list',
  CHANTING_ATTENDANCE = 'chanting_attendance',
  COUNCIL_PROGRAM = 'council_program',
  REPORTS = 'reports',
  MANAGERS = 'managers',
}
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}
