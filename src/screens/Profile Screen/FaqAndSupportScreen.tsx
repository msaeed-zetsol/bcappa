import { StyleSheet, StatusBar } from "react-native";
import React from "react";
import { View } from "native-base";
import { verticalScale, horizontalScale } from "../../utilities/Dimensions";
import { useNavigation } from "@react-navigation/native";
import { newColorTheme } from "../../constants/Colors";
import ProfileInformationRow from "../../components/ProfileInformationRow";
import Heading from "../../components/Heading";
import { useTranslation } from "react-i18next";

const FaqAndSupportScreen = () => {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <View
      flex={1}
      bg={"BACKGROUND_COLOR"}
      pt={verticalScale(15)}
      px={horizontalScale(22)}
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <Heading name={t("faqs")} navigation={navigation} />

      <View mt={verticalScale(30)} />
      <ProfileInformationRow heading={t("what_is_bcappa")} onPress={() => {}} />
      <ProfileInformationRow
        heading={t("general_information")}
        onPress={() => {}}
      />
      <ProfileInformationRow heading={t("payments")} onPress={() => {}} />
      <ProfileInformationRow heading={t("how_it_works")} onPress={() => {}} />
    </View>
  );
};

export default FaqAndSupportScreen;

const styles = StyleSheet.create({});
