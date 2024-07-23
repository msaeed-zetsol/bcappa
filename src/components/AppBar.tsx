import React from "react";
import { I18nManager, StatusBar, TouchableOpacity } from "react-native";
import { View, Text } from "native-base";
import { horizontalScale, verticalScale } from "../utilities/Dimensions";
import { Fonts, Images } from "../constants";
import { newColorTheme } from "../constants/Colors";

type AppBarProps = {
  name: string;
  color?: string;
  onPress: () => void;
};

const AppBar: React.FC<AppBarProps> = ({ name, color = "#06202E", onPress }) => {
  return (

    <View
      flexDirection="row"
      alignItems="center"
      mt={verticalScale(25)}
      justifyContent="center"
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          left: 0,
        }}
        onPress={onPress}
      >
        <Images.BackButton
          width={horizontalScale(50)}
          height={verticalScale(50)}
          style={{
            transform: [{ rotateY: I18nManager.isRTL ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>
      <Text
        textAlign="center"
        fontSize={verticalScale(20)}
        color={color}
        fontFamily={Fonts.POPPINS_BOLD}
      >
        {name}
      </Text>
    </View>
  );
};

export default AppBar;
