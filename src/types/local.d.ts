/**
 * These type represent ephemeral state of the app.
 */

type Member = {
  id?: string;
  fullName: string;
  phone: string;
  openingPrecedence: number;
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
  countryCode: string;
  dob: string;
  role: "customer";
};