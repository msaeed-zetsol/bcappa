import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigator from "../bottom-navigator/BottomNavigator";
import AuthStack, { AuthStackParamList } from "./AuthStack";
import VerifiedAccountDetails from "../../screens/jazzDost/VerifiedAccountDetails";
import UpdatePersonalInformationScreen from "../../screens/profile/UpdatePersonalInformationScreen";
import TermsAndConditionScreen from "../../screens/others/TermsAndConditionScreen";
import FaqAndSupportScreen from "../../screens/faq/FaqAndSupportScreen";
import LanguageScreen from "../../screens/language/LanguageScreen";
import MyRewardsScreen from "../../screens/rewards/MyRewardsScreen";
import JazzDostVerificationScreen from "../../screens/jazzDost/JazzDostVerificationScreen";
import JazzDostSignup from "../../screens/jazzDost/JazzDostSignup";
import CreateOrUpdateBcScreen from "../../screens/create-private-bc/CreateOrUpdateBcScreen";
import UserSchedule from "../../screens/bcs/UserSchedule";
import SeeAll from "../../screens/home/SeeAll";
import AddUpdateMembersScreen from "../../screens/create-private-bc/AddUpdateMembersScreen";
import BcDetailsScreen from "../../screens/bcs/BcDetailsScreen";
import SummaryScreen from "../../screens/bcs/SummaryScreen";
import BcCreatedScreen from "../../screens/create-private-bc/BcCreatedScreen";
import BcSettingsScreen from "../../screens/profile/bc-settings/BcSettingsScreen";

export type RootStackParamList = {
  AuthStack: AuthStackParamList;
  BottomNavigator: undefined;
  TermsAndConditions: undefined;
  BcCreatedScreen: { bcId: string };
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
  BcSettingsScreen: undefined;
  CreateOrUpdateBcScreen: {
    bc?: MyBc;
  };
  AddUpdateMembersScreen: {
    bcId: number;
    isBalloting: boolean;
    maxUsers: number;
    updatingBc: boolean;
  };
  SeeAll: undefined;
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
        component={UpdatePersonalInformationScreen}
      />
      <Stack.Screen name="FaqAndSupport" component={FaqAndSupportScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="MyRewards" component={MyRewardsScreen} />
      <Stack.Screen
        name="JazzDostVerification"
        component={JazzDostVerificationScreen}
      />
      <Stack.Screen name="JazzDostSignup" component={JazzDostSignup} />
      <Stack.Screen
        name="CreateOrUpdateBcScreen"
        component={CreateOrUpdateBcScreen}
      />
      <Stack.Screen
        name="AddUpdateMembersScreen"
        component={AddUpdateMembersScreen}
      />
      <Stack.Screen name="BcSettingsScreen" component={BcSettingsScreen} />
      <Stack.Screen name="SeeAll" component={SeeAll} />
      <Stack.Screen name="BcCreatedScreen" component={BcCreatedScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
