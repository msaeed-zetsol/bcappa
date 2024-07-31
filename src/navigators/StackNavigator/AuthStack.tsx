import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "../../screens/forgotpassword/ForgotPassword";
import NewPassword from "../../screens/changepassword/NewPassword";
import OnboardingScreen from "../../screens/onboarding/onboardingScreen";
import SplashScreen from "../../screens/splash/SplashScreen";
import LoginScreen from "../../screens/login/LoginScreen";
import SignupScreen from "../../screens/signup/SignupScreen";
import AccountVerificationScreen, {
  VerificationType,
} from "../../screens/verification/AccountVerificationScreen";

export type AuthStackParamList = {
  Splash: undefined;
  OnBoardScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  Forgot: undefined;
  AccountVerificationScreen: {
    email?: string;
    phone?: string;
    verificationType: VerificationType;
    transferrableValues?: SignupFormValues;
  };
  NewPassword: {
    emailOrPhone: string;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="OnBoardScreen" component={OnboardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="Forgot" component={ForgotPassword} />
      <Stack.Screen
        name="AccountVerificationScreen"
        component={AccountVerificationScreen}
      />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
