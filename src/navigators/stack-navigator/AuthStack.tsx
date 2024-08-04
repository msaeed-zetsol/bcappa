import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "../../screens/forgot-password/ForgotPasswordScreen";
import ChangePasswordScreen from "../../screens/change-password/ChangePasswordScreen";
import OnboardingScreen from "../../screens/onboarding/OnboardingScreen";
import SplashScreen from "../../screens/splash/SplashScreen";
import LoginScreen from "../../screens/login/LoginScreen";
import SignupScreen from "../../screens/signup/SignupScreen";
import AccountVerificationScreen, {
  VerificationType,
} from "../../screens/account-verification/AccountVerificationScreen";

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
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="AccountVerificationScreen"
        component={AccountVerificationScreen}
      />
      <Stack.Screen name="NewPassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
