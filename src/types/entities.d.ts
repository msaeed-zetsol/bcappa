/**
 * Types representing entities in database are defined here.
 */

// bc members
type BcMemberType = "admin" | "member";

type BcMemberStatus = "pending" | "opened" | "current" | "defaulter";

type BcMember = {
  id: string;
  openingPrecedence: number;
  memberType: BcMemberType;
  bcMemberStatus: BcMemberStatus;
};

// users
type UserType = "internal" | "external";

type Gender = "male" | "female" | "other";

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cnic: string;
  dob: string;
  password: string;
  profileImg: string | null;
  monthlyAmount: number;
  fcmToken: string;
  sessionToken: string;
  googleId: string | null;
  userType: UserType;
  gender: Gender;
};

// user settings
type UserSetting = {
  id: number;
  signupType: string;
  isProfileCreated: number;
  isJazzDostVerified: number;
};

// bcs
type BcStatus = "pending" | "active" | "complete";

type BcType = "public" | "private";

type BcSelectionType = "auto" | "manual";

type BC = {
  id: string;
  title: string;
  status: BcStatus;
  amount: number;
  maxMembers: number;
  currentIteration: number;
  commenceDate: string;
  bcOpeningDate: string;
  selectionType: BcSelectionType;
};

// notifications
type Notification = {
  id: number;
  title: string;
  description: string;
};

// splash screen
type Splash = {
  id: number;
  image: string;
  startDate: string;
  endDate: string;
};

// payments
type Payment = {
  id: number;
  paid: number;
  paitAt: string;
  month: string;
};
