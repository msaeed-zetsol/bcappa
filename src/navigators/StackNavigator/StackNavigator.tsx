import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigator from "../BottomNavigator/BottomNavigator";
import AuthStack from "./AuthStack";
import VerifiedAccountDetails from "../../screens/Profile Screen/VerifiedAccountDetails";
import PersonalInformationScreen from "../../screens/Profile Screen/PersonalInformationScreen";
import TermsAndConditionScreen from "../../screens/Authentication/TermsAndConditionScreen";
import FaqAndSupportScreen from "../../screens/Profile Screen/FaqAndSupportScreen";
import LanguageScreen from "../../screens/Profile Screen/LanguageScreen";
import MyRewardsScreen from "../../screens/Profile Screen/MyRewardsScreen";
import JazzDostVerificationScreen from "../../screens/Profile Screen/JazzDostVerificationScreen";
import JazzDostSignup from "../../screens/Profile Screen/JazzDostSignup";
import NewBc from "../../screens/CreateNewBc/NewBc";
import UserSchedule from "../../screens/My BC's Screen/UserSchedule";
import UpdateBc from "../../screens/CreateNewBc/UpdateBc";
import SeeAll from "../../screens/HomeScreen/SeeAll";
import AddMembers from "../../screens/CreateNewBc/AddMembers";
import BcDetailsScreen from "../../screens/My BC's Screen/BcDetailsScreen";
import SummaryScreen from "../../screens/My BC's Screen/SummaryScreen";
import BcCreated from "../../screens/CreateNewBc/BcCreated";

export type RootStackParamList = {
  AuthStack: undefined;
  BottomNavigator: undefined;
  TermsAndConditions: undefined;
  BcCreated: { bcId: string };
  BcDetailsScreen: undefined;
  UserSchedule: undefined;
  SummaryScreen: undefined;
  VerifiedAccountDetails: undefined;
  PersonalInformation: undefined;
  FaqAndSupport: undefined;
  Language: undefined;
  MyRewards: undefined;
  JazzDostVerification: undefined;
  JazzDostSignup: undefined;
  NewBc: undefined;
  AddMembers: undefined;
  SeeAll: undefined;
  UpdateBc: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="AuthStack"
    >
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionScreen}
      />

      <Stack.Screen name="BcDetailsScreen" component={BcDetailsScreen} />
      <Stack.Screen name="UserSchedule" component={UserSchedule} />

      <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
      <Stack.Screen
        name="VerifiedAccountDetails"
        component={VerifiedAccountDetails}
      />
      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformationScreen}
      />
      <Stack.Screen name="FaqAndSupport" component={FaqAndSupportScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="MyRewards" component={MyRewardsScreen} />
      <Stack.Screen
        name="JazzDostVerification"
        component={JazzDostVerificationScreen}
      />
      <Stack.Screen name="JazzDostSignup" component={JazzDostSignup} />
      <Stack.Screen name="NewBc" component={NewBc} />
      <Stack.Screen name="AddMembers" component={AddMembers} />

      <Stack.Screen name="SeeAll" component={SeeAll} />
      <Stack.Screen name="UpdateBc" component={UpdateBc} />
      <Stack.Screen name="BcCreated" component={BcCreated} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
