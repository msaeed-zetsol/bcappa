import { StyleSheet } from "react-native";
import React from "react";
import { View } from "native-base";
import { verticalScale, horizontalScale } from "../../utilities/dimensions";
import { useNavigation } from "@react-navigation/native";
import { newColorTheme } from "../../constants/Colors";
import ProfileInformationRow from "../../components/ProfileInformationRow";
import { useTranslation } from "react-i18next";
import { Images } from "../../constants";
import AppBar from "../../components/AppBar";

const FaqAndSupportScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View
      flex={1}
      bg={"BACKGROUND_COLOR"}
      pt={verticalScale(15)}
      px={horizontalScale(22)}
    >
      <AppBar name={t("faqs")} onPress={navigation.goBack} />
      <View mt={verticalScale(30)} />
      <ProfileInformationRow
        heading={t("what_is_bcappa")}
        onPress={() => { }}
        startIcon={{ Icon: Images.AccountNotVerified }}
        endIconMode={"navigation"}
      />
      <ProfileInformationRow
        heading={t("general_information")}
        onPress={() => { }}
        startIcon={{ Icon: Images.AccountNotVerified }}
        endIconMode={"navigation"}
      />
      <ProfileInformationRow
        heading={t("payments")}
        onPress={() => { }}
        startIcon={{ Icon: Images.AccountNotVerified }}
        endIconMode={"navigation"}
      />
      <ProfileInformationRow
        heading={t("how_it_works")}
        onPress={() => { }}
        startIcon={{ Icon: Images.AccountNotVerified }}
        endIconMode={"navigation"}
      />
    </View>
  );
};

export default FaqAndSupportScreen;

const styles = StyleSheet.create({});
