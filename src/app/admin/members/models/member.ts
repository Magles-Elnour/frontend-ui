import { BEResponse } from '../../../models/shared-models';
export class Member {
  id?: string;
  name?: string | null;
  groupNumber?: number | null;
  partNumber?: number | null;
  place?: boolean | null;
  phoneNumber?: string | null;
}

export interface MemberResponse extends BEResponse {
  content: Member[];
}
export const membersTestData: MemberResponse = {
  content: [
    {
      id: '1',
      name: 'أحمد محمد على',
      groupNumber: 1,
      partNumber: 1,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: '2',
      name: 'عمرو محمد المكاوى',
      groupNumber: 2,
      partNumber: 2,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: '3',
      name: 'محمد حسن احمد',
      groupNumber: 3,
      partNumber: 3,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: '4',
      name: 'عبد الله محمد عبد الله',
      groupNumber: 4,
      partNumber: 4,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: '5',
      name: 'ياسر جلال محمد احمد',
      groupNumber: 5,
      partNumber: 5,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: '6',
      name: 'مصطفى عبد العال السيد',
      groupNumber: 6,
      partNumber: 6,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: '7',
      name: 'يحيي محمد على',
      groupNumber: 7,
      partNumber: 7,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: '8',
      name: 'خالد حسن الصاوى',
      groupNumber: 8,
      partNumber: 8,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: 'string',
      name: 'محمود عبد الجليل احمد',
      groupNumber: 9,
      partNumber: 9,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: 'string',
      name: 'مصطفى محمد القفطاوى',
      groupNumber: 10,
      partNumber: 10,
      place: false,
      phoneNumber: '2012345678910',
    },
    {
      id: 'string',
      name: 'ابراهيم جلال ابراهيم',
      groupNumber: 11,
      partNumber: 11,
      place: true,
      phoneNumber: '2012345678910',
    },
    {
      id: 'string',
      name: 'عبد الغنى محمد احمد',
      groupNumber: 12,
      partNumber: 12,
      place: false,
      phoneNumber: '2012345678910',
    },
    {
      id: 'string',
      name: 'ابراهيم محمد محمود',
      groupNumber: 13,
      partNumber: 13,
      place: true,
      phoneNumber: '2012345678910',
    },
  ],
  number: 0,
  size: 13,
  totalElements: 50,
  totalPages: 4,
};
