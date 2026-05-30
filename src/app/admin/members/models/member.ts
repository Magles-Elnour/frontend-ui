import { BEResponse } from '../../../models/shared-models';

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REMOVED = 'REMOVED',
  DIED = 'DIED',
}

export interface Member {
  id?: number;
  name?: string | null;
  phoneNumber?: string | null;
  status?: MemberStatus | null;
  startDate?: string | null;
}

export interface MemberResponse extends BEResponse {
  content: Member[];
}

export interface CreateMemberRequest {
  name: string;
  phoneNumber?: string | null;
  status?: MemberStatus | null;
  startDate?: string | null;
}

export interface UpdateMemberRequest {
  name: string;
  phoneNumber?: string | null;
  status?: MemberStatus | null;
  startDate?: string | null;
}
