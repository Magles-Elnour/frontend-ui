export interface Account {
  id?: string;
  username?: string;
  role?: UserRole;
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

export enum UserRole {
  ADMIN = 'ADMIN',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  USER = 'USER',
}

export interface BEResponse {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
