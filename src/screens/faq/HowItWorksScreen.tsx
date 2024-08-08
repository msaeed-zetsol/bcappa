import { View, Text } from "native-base";
import React from "react";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Fonts } from "../../constants";
import AppBar from "../../components/AppBar";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators/stack-navigator/StackNavigator";

type HowItWorksScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "HowItWorksScreen"
>;

const HowItWorksScreen = ({ navigation }: HowItWorksScreenProps) => {
  const { t } = useTranslation();

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} px={horizontalScale(20)}>
      <AppBar name={t("how_it_works")} onPress={navigation.goBack} />
      <Text mt={verticalScale(35)} fontFamily={Fonts.POPPINS_MEDIUM}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.{"\n"} Lorem ipsum dolor sit amet,
        consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </View>
  );
};

export default HowItWorksScreen;
