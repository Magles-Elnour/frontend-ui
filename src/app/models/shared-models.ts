export class Account {
  id?: string;
  name?: string | null;
  roles?: UserRoles[] | null;
}

export enum UrlsNames {
  ADMIN = 'admin',
  MEMBERS = 'members',
  MEMBERS_LIST = 'list',
  MEMBERS_ATTENDANCE = 'attendance',
  MEMBERS_ADD = 'add',
  MEMBERS_EDIT = 'edit',
  CHANTING = 'chanting',
  CHANTING_LIST = 'list',
  CHANTING_ATTENDANCE = 'attendance',
  COUNCIL_PROGRAM = 'council-program',
  REPORTS = 'reports',
  MANAGERS = 'managers',
}
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export interface BEResponse {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
