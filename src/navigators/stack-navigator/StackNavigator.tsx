import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigator, {
  TabParamsList,
} from "../bottom-navigator/BottomNavigator";
import AuthStack, { AuthStackParamList } from "./AuthStack";
import VerifiedAccountDetails from "../../screens/jazzDost/VerifiedAccountDetails";
import UpdateProfileScreen from "../../screens/update-profile/UpdateProfileScreen";
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
import { NavigatorScreenParams } from "@react-navigation/native";
import BcAppaOverviewScreen from "../../screens/faq/BcAppaOverviewScreen";
import GeneralInformationScreen from "../../screens/faq/GeneralInformationScreen";
import PaymentsInformationScreen from "../../screens/faq/PaymentsInformation";
import HowItWorksScreen from "../../screens/faq/HowItWorksScreen";

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  BottomNavigator: NavigatorScreenParams<TabParamsList>;
  TermsAndConditions: undefined;
  BcCreatedScreen: { bcId: string };
  BcDetailsScreen: {
    bcId: string;
    deeplink: boolean;
  };
  UserSchedule: undefined;
  SummaryScreen: undefined;
  VerifiedAccountDetails: undefined;
  UpdateProfileScreen: {
    profile: ProfileResponse;
  };
  FaqAndSupport: undefined;
  BcAppaOverviewScreen: undefined;
  GeneralInformationScreen: undefined;
  PaymentsInformationScreen: undefined;
  HowItWorksScreen: undefined;
  Language: undefined;
  MyRewards: undefined;
  JazzDostVerification: undefined;
  JazzDostSignup: undefined;
  CreateOrUpdateBcScreen: {
    bc?: MyBc;
  };
  AddUpdateMembersScreen: {
    bcId: string;
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
        navigationBarColor: "white",
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
        name="UpdateProfileScreen"
        component={UpdateProfileScreen}
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
      <Stack.Screen name="SeeAll" component={SeeAll} />
      <Stack.Screen name="BcCreatedScreen" component={BcCreatedScreen} />
      <Stack.Screen name="BcAppaOverviewScreen" component={BcAppaOverviewScreen}/>
      <Stack.Screen name="GeneralInformationScreen" component={GeneralInformationScreen}/>
      <Stack.Screen name="PaymentsInformationScreen" component={PaymentsInformationScreen}/>
      <Stack.Screen name="HowItWorksScreen" component={HowItWorksScreen}/>
    </Stack.Navigator>
  );
};

export default StackNavigator;
