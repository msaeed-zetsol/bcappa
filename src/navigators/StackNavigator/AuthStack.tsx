import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "../../screens/Authentication/ForgotPassword";
import NewPassword from "../../screens/Authentication/NewPassword";
import OnBoardScreen from "../../screens/AppOnBoarding/AppOnBoardingScreen";
import SplashScreen from "../../screens/splash/SplashScreen";
import LoginScreen from "../../screens/Authentication/LoginScreen";
import SignupScreen from "../../screens/Authentication/SignupScreen";
import OtpAccountVerification from "../../screens/Authentication/OtpAccountVerification";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="Forgot" component={ForgotPassword} />
      <Stack.Screen
        name="OtpAccountVerification"
        component={OtpAccountVerification}
      />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
