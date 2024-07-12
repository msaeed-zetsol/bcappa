import { StyleSheet } from "react-native";
import { freeSpeechRed } from "../constants/Colors";
import { verticalScale } from "../utilities/Dimensions";
import { Fonts } from "../constants";

const globalStyles = StyleSheet.create({
  errorText: {
    color: freeSpeechRed,
    marginTop: verticalScale(5),
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: 14,
    marginStart: 16,
  },
});

export default globalStyles;
