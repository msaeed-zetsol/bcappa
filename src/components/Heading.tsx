import React from "react";
import { I18nManager, TouchableOpacity } from "react-native";
import { View, Text } from "native-base";
import { horizontalScale, verticalScale } from "../utilities/Dimensions";
import { Fonts, Images } from "../constants";

type HeadingProps = {
  name: string;
  color?: string;
  onPress: () => void;
};

const Heading = ({ name, color = "#06202E", onPress }: HeadingProps) => {
  return (
    <View
      flexDirection="row"
      alignItems="center"
      mt={verticalScale(25)}
      justifyContent={"center"}
    >
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

export default Heading;
