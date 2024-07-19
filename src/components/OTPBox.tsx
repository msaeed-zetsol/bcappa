import { View } from "native-base";
import { StyleSheet, TextInput } from "react-native";
import { Colors } from "../constants";
import { horizontalScale, verticalScale } from "../utilities/Dimensions";
import { forwardRef, RefObject } from "react";
import { deepSkyBlue } from "../constants/Colors";

export type OTP = Record<OTPIndex, string>;

export type OTPIndex = "first" | "second" | "third" | "fourth" | "fifth";

type OTPBoxProps = {
  otp: OTP;
  index: OTPIndex;
  onChange: (otp: OTP) => void;
  previous?: RefObject<TextInput>;
  next?: RefObject<TextInput>;
};

const OTPBox = forwardRef<TextInput, OTPBoxProps>(
  ({ otp, index, onChange, previous, next }: OTPBoxProps, ref) => {
    return (
      <View style={styles.otpBox}>
        <TextInput
          cursorColor={deepSkyBlue}
          style={styles.otpText}
          keyboardType="number-pad"
          maxLength={1}
          ref={ref}
          value={otp[index]}
          onChangeText={(value) => {
            if (!!value) {
              if (!isNaN(+value)) {
                onChange({ ...otp, [`${index}`]: value });
                next?.current?.focus();
              }
            }
          }}
          onKeyPress={(event) => {
            if (event.nativeEvent.key === "Backspace") {
              onChange({ ...otp, [`${index}`]: "" });
              previous?.current?.focus();
            } else if (!isNaN(+event.nativeEvent.key)) {
              onChange({ ...otp, [`${index}`]: event.nativeEvent.key });
              next?.current?.focus();
            }
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  otpBox: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: verticalScale(12),
  },
  otpText: {
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: horizontalScale(4),
    paddingVertical: verticalScale(2),
    color: Colors.BLACK_COLOR,
    fontWeight: "bold",
  },
});

export default OTPBox;
