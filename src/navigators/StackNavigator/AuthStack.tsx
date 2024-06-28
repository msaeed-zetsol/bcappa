import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LoginScreen,
  OtpAccountVerification,
  SignupScreen,
  WelcomeScreen,
} from '../../screens';
import {AuthStackNavigatorParamList} from '../types';
import ForgotPassword from '../../screens/Authentication/ForgotPassword';
import NewPassword from '../../screens/Authentication/NewPassword';
import OnBoardScreen from '../../screens/AppOnBoarding/AppOnBoardingScreen';

const Auth = createNativeStackNavigator<AuthStackNavigatorParamList>();
const AuthStack = () => {
  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Auth.Screen name="OnBoardScreen" component={OnBoardScreen} />
      <Auth.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Auth.Screen name="LoginScreen" component={LoginScreen} />
      <Auth.Screen name="SignupScreen" component={SignupScreen} />
      <Auth.Screen name="Forgot" component={ForgotPassword} />
      <Auth.Screen
        name="OtpAccountVerification"
        component={OtpAccountVerification}
      />
      <Auth.Screen name="NewPassword" component={NewPassword} />
    </Auth.Navigator>
  );
};

export default AuthStack;
