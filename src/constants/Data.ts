import {BcData, members} from '../interface/Interface';
import {StatusEnums} from '../lookups/Enums';

export const Bc_Details: BcData[] = [
  {
    id: '1',
    BcName: 'Lorem ipsum dolor sit amet',
    peopleJoined: 20,
    status: StatusEnums.IN_PROGRESS,
    expectedMonthlyAmount: 15000,
    monthlyAmount: 10000,
  },
  {
    id: '2',
    BcName: 'Lorem ipsum dolor sit amet',
    peopleJoined: 25,
    status: StatusEnums.YET_TO_START,
    expectedMonthlyAmount: 10000,
    monthlyAmount: 20000,
  },
  {
    id: '3',
    BcName: 'Lorem ipsum dolor sit amet',
    peopleJoined: 30,
    status: StatusEnums.IN_PROGRESS,
    expectedMonthlyAmount: 20000,
    monthlyAmount: 15000,
  },
];

export const MemberDetails: members[] = [
  {
    id: '1',
    memberName: 'Emma jane',
  },
  {
    id: '2',
    memberName: 'Emma jane',
  },
  {
    id: '3',
    memberName: 'Emma jane',
  },
  {
    id: '4',
    memberName: 'Emma jane',
  },
  {
    id: '5',
    memberName: 'Emma jane',
  },
  {
    id: '6',
    memberName: 'Emma jane',
  },
];
