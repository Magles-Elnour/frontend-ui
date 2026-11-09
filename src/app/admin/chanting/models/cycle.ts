import { BEResponse } from '../../../models/shared-models';

export enum CycleStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export interface Cycle {
  id: number;
  number: number;
  startDate: string;
  status: CycleStatus;
}

export interface CycleResponse extends BEResponse {
  content: Cycle[];
}

export interface CreateCycleRequest {
  number: number;
  startDate: string;
}
