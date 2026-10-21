import { MemberStatus } from './member';

export type MembersFilterValue = Partial<{
  name: string | null;
  status: MemberStatus | null;
}>;