import { View } from "native-base";
import { StyleSheet, TextInput } from "react-native";
import { Colors } from "../constants";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
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
  readonly?: boolean;
};

const OTPBox = forwardRef<TextInput, OTPBoxProps>(
  ({ otp, index, onChange, previous, next, readonly }: OTPBoxProps, ref) => {
    return (
      <View
        style={[
          styles.otpBox,
          readonly ? styles.readOnlyBox : styles.activeBox,
        ]}
      >
        <TextInput
          readOnly={readonly}
          cursorColor={deepSkyBlue}
          style={styles.otpText}
          keyboardType="number-pad"
          maxLength={1}
          ref={ref}
          value={otp[index]}
          onChangeText={(value) => {
            if (!!value) {
              if (!isNaN(+value)) {
                next?.current?.focus();
                onChange({ ...otp, [`${index}`]: value });
              }
            }
          }}
          onKeyPress={(event) => {
            if (event.nativeEvent.key === "Backspace") {
              previous?.current?.focus();
              onChange({ ...otp, [`${index}`]: "" });
            } else if (!isNaN(+event.nativeEvent.key)) {
              next?.current?.focus();
              onChange({ ...otp, [`${index}`]: event.nativeEvent.key });
            }
          }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  otpBox: {
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: verticalScale(12),
  },
  activeBox: { borderColor: Colors.GREY },
  readOnlyBox: { backgroundColor: "#ececec", borderColor: "#ececec" },
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
