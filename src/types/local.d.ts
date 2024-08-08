/**
 * These type represent ephemeral state of the app.
 */
type Member = {
  id?: string;
  fullName: string;
  phone: string;
  openingPrecedence?: number;
};

type BcStatusColor = {
  color: string;
  backgroundColor: string;
};

// Forms
type LoginFormValues = {
  email: string;
  password: string;
};

type SignupFormValues = {
  fullName: string;
  email: string;
  phone: string;
  cnic: string;
  password: string;
  gender: string;
  dob: string;
  role: "customer";
};

type ProfileFormValues = {
  fullName: string;
  email?: string;
  phone: string;
  cnic: string;
  password: string;
  gender: string;
  dob: string;
};

type ForgotPasswordFormValues = {
  email?: string;
  phone?: string;
};

type NewPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

type CreateBcFormValues = {
  title: string;
  maxUsers: string;
  amountPerMonth: string;
  startingDate: string;
  isBalloting: boolean;
};
