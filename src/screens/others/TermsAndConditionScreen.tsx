import { View, Text } from "native-base";
import React from "react";
import { newColorTheme } from "../../constants/Colors";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Fonts } from "../../constants";
import AppBar from "../../components/AppBar";

const TermsAndConditionScreen = () => {
  const navigation = useNavigation();
  const route: any = useRoute();

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} px={horizontalScale(20)}>
      <AppBar name={route.params.name} onPress={navigation.goBack} />
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

export default TermsAndConditionScreen;
