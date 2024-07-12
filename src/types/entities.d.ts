/**
 * Types representing entities in database are defined here.
 */

// bc members
enum BcMemberType {
  ADMIN = "admin",
  MEMBER = "member",
}

enum BcMemberStatus {
  PENDING = "pending",
  OPENED = "opened",
  CURRENT = "current",
  DEFAULTER = "defaulter",
}

type BcMember = {
  id: string;
  openingPrecedence: number;
  memberType: BcMemberType;
  bcMemberStatus: BcMemberStatus;
};

// users
enum UserType {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cnic: string;
  dob: string;
  password: string;
  profileImg: string;
  monthlyAmount: number;
  fcmToken: string;
  sessionToken: string;
  googleId: string;
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
enum BcStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETE = "complete",
}

enum BcType {
  PUBLIC = "public",
  PRIVATE = "private",
}

enum BcSelectionType {
  AUTO = "auto",
  MANUAL = "manual",
}

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
