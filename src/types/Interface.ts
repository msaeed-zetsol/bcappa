export interface BcData {
  id: string;
  BcName: string;
  peopleJoined: number;
  status: string;
  expectedMonthlyAmount?: number;
  monthlyAmount?: number;
}

export interface members {
  id: string;
  imageUrl?: string;
  memberName: string;
}

export interface CardData {
  id?: string;
  image?: any;
  name?: string;
  rating: number;
  committees?: number;
  amount?: number;
}

export interface Notifications {
  id: string;
  status: number;
  message: string;
  time: string;
}

export type IFIilterType = "eq" | "neq" | "like" | "contains" | "json";

export interface IFilter {
  field: string;
  type: IFIilterType;
  value: string;
}

export interface apiMiddleware {
  url: string;
  method: string;
  data?: any;
  filterParams?: IFilter[];
  reduxDispatch?: any;
  navigation?: any;
  contentType?: string;
}

export interface Profile {
  cnic: string;
  createdAt: string;
  dob: string;
  email: string;
  fullName: string;
  id: string;
  monthlyAmount: number | null;
  phone: string;
  profileImg: string | null;
  sessionToken: string;
  settings: {
    createdAt: string;
    id: number;
    isJazzDostVerified: boolean;
    isProfileCreated: boolean;
    signupType: string;
    updatedAt: string;
  };
  updatedAt: string;
}
