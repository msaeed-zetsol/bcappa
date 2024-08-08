import React from "react";
import { View } from "native-base";
import { verticalScale, horizontalScale } from "../../utilities/dimensions";
import ProfileInformationRow from "../../components/ProfileInformationRow";
import { useTranslation } from "react-i18next";
import AppBar from "../../components/AppBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators/stack-navigator/StackNavigator";

type FAQProps = NativeStackScreenProps<RootStackParamList, "FaqAndSupport">;

const FaqAndSupportScreen = ({ navigation }: FAQProps) => {
  const { t } = useTranslation();

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} pt={verticalScale(15)}>
      <AppBar
        name={t("faqs")}
        onPress={navigation.goBack}
        style={{ marginHorizontal: horizontalScale(22) }}
      />
      <View mt={verticalScale(30)} />
      <ProfileInformationRow
        heading={t("what_is_bcappa")}
        onPress={() => navigation.navigate("BcAppaOverviewScreen")}
        endIconMode={"navigation"}
      />
      <ProfileInformationRow
        heading={t("general_information")}
        onPress={() => navigation.navigate("GeneralInformationScreen")}
        endIconMode={"navigation"}
      />
      <ProfileInformationRow
        heading={t("payments")}
        onPress={() => navigation.navigate("PaymentsInformationScreen")}
        endIconMode={"navigation"}
      />
      <ProfileInformationRow
        heading={t("how_it_works")}
        onPress={() => navigation.navigate("HowItWorksScreen")}
        endIconMode={"navigation"}
      />
    </View>
  );
};

export default FaqAndSupportScreen;
