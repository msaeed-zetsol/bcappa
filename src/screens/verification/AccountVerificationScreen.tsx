import {
  StyleSheet,
  StatusBar,
  TextInput,
  Keyboard,
  TouchableOpacity,
  I18nManager,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { View, Pressable, Heading, Text, Button } from "native-base";
import { Colors, Images, Fonts } from "../../constants";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { CommonActions, StackActions } from "@react-navigation/native";
import { deepSkyBlue, newColorTheme } from "../../constants/Colors";
import { apimiddleWare, formatTime } from "../../utilities/helper-functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks/hooks";
import OTPBox, { OTP } from "../../components/OTPBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigators/stackNavigator/AuthStack";
import AppBar from "../../components/AppBar";

type AccountVerificationProps = NativeStackScreenProps<
  AuthStackParamList,
  "AccountVerificationScreen"
>;

export type VerificationType = "email" | "phone";

const AccountVerificationScreen = ({
  route,
  navigation,
}: AccountVerificationProps) => {
  const { email, phone, verificationType, transferrableValues } = route.params;

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const firstInput = useRef<TextInput>(null);
  const secondInput = useRef<TextInput>(null);
  const thirdInput = useRef<TextInput>(null);
  const fourthInput = useRef<TextInput>(null);
  const fifthInput = useRef<TextInput>(null);

  const [OTP, setOTP] = useState<OTP>({
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
  });

  const [isSendingOTP, setSendingOTP] = useState(true);

  const [timer, setTimer] = useState(10);
  const [restart, setRestart] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAlternativeOptionAvailable = () => {
    if (verificationType === "email") {
      return phone !== undefined;
    } else {
      return email !== undefined;
    }
  };

  useEffect(() => {
    if (timer === 0) {
      timeoutRef.current && clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [timer]);

  useEffect(() => {
    if (restart > 0) {
      const interval = setInterval(() => {
        setTimer((it) => it - 1);
      }, 1000);
      timeoutRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [restart]);

  useEffect(() => {
    sendVerificationCodeTo(verificationType);
  }, []);

  const sendVerificationCodeTo = async (type: VerificationType) => {
    setSendingOTP(true);
    let data = type === "email" ? { email: email } : { phone: phone };

    await apimiddleWare({
      url: "/otp",
      method: "post",
      data: data,
      reduxDispatch: dispatch,
      navigation,
    });

    setSendingOTP(false);
    setRestart((it) => it + 1);
  };

  //verify Otp
  const LoginHandler = async (details: any) => {
    const getToken: any = await AsyncStorage.getItem("fcmToken");
    const parsedFcmToken: any = await JSON.parse(getToken);

    Keyboard.dismiss();
    setLoading(true);

    const data = {
      email: details.email,
      password: details.password,
      fcmToken: parsedFcmToken,
    };

    try {
      const response = await apimiddleWare({
        url: "/auth/login",
        method: "post",
        data: data,
        reduxDispatch: dispatch,
        navigation: navigation,
      });

      if (response) {
        const loginUserDataString = await JSON.stringify(response);
        await AsyncStorage.setItem("loginUserData", loginUserDataString);
        navigation.dispatch(
          StackActions.replace("BottomNavigator", {
            screen: "HomeScreen",
            params: {
              screenName: "Signup",
              show: true,
            },
          })
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // const verifyOtp = async () => {
  //   setLoading(true);
  //   Keyboard.dismiss();
  //   const concatenatedOtp = Object.values(OTP).join("");

  //   const payloadData: any = {
  //     otpCode: concatenatedOtp,
  //     phone: values.phone,
  //   };

  //   if (whatTosend === "email") {
  //     payloadData.email = values.email;
  //     delete payloadData.phone;
  //   }

  //   const response = await apimiddleWare({
  //     url: "/otp/verify",
  //     method: "post",
  //     data: payloadData,
  //     reduxDispatch: dispatch,
  //     navigation,
  //   });

  //   if (response) {
  //     const response = await apimiddleWare({
  //       url: "/auth/signup",
  //       method: "post",
  //       data: values,
  //       reduxDispatch: dispatch,
  //       navigation,
  //     });
  //     if (response) {
  //       await LoginHandler(values);
  //       setLoading(false);
  //     }
  //   }
  //   setLoading(false);
  // };

  // const verifyToGivenInfo = async () => {
  //   setLoading(true);
  //   Keyboard.dismiss();
  //   const concatenatedOtp = Object.values(OTP).join("");

  //   if (values.email) {
  //     var payloadData: any = {
  //       otpCode: concatenatedOtp,
  //       email: values.email,
  //     };
  //   } else if (values.phone) {
  //     var payloadData: any = {
  //       otpCode: concatenatedOtp,
  //       phone: values.phone,
  //       Number,
  //     };
  //   }

  //   const response = await apimiddleWare({
  //     url: "/otp/verify",
  //     method: "post",
  //     data: payloadData,
  //     reduxDispatch: dispatch,
  //     navigation,
  //   });

  //   if (response) {
  //     console.log({ response });
  //     setLoading(false);
  //     navigation.dispatch(
  //       CommonActions.navigate("NewPassword", {
  //         values,
  //       })
  //     );
  //   }

  //   setLoading(false);
  // };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={newColorTheme.WHITE_COLOR}
        barStyle={"dark-content"}
      />

      <View>
        <AppBar name={t("account_verification")} onPress={navigation.goBack} />
        {!isSendingOTP && (
          <>
            <Text
              fontSize={"sm"}
              mt={verticalScale(24)}
              color={"#949494"}
              fontWeight="500"
              fontFamily={Fonts.POPPINS_MEDIUM}
            >
              {t("enter_4_digit_code_sent", { type: verificationType })}{" "}
              <Text color={"BLACK_COLOR"}>
                {verificationType === "email" ? email : phone}
              </Text>
            </Text>

            <View style={styles.otpContainer}>
              <OTPBox
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="first"
                next={secondInput}
                ref={firstInput}
              />
              <OTPBox
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="second"
                previous={firstInput}
                next={thirdInput}
                ref={secondInput}
              />
              <OTPBox
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="third"
                previous={secondInput}
                next={fourthInput}
                ref={thirdInput}
              />
              <OTPBox
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="fourth"
                previous={thirdInput}
                next={fifthInput}
                ref={fourthInput}
              />
              <OTPBox
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="fifth"
                previous={fourthInput}
                ref={fifthInput}
              />
            </View>

            {/* Timer */}
            {timer !== 0 && (
              <View alignItems="center" mt={verticalScale(15)}>
                <Text color={"BLACK_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
                  {t("resend_code_in")}{" "}
                  <Text
                    color={"PRIMARY_COLOR"}
                    fontFamily={Fonts.POPPINS_MEDIUM}
                  >
                    {formatTime(timer)}
                  </Text>
                </Text>
              </View>
            )}

            {/* Trouble Receiving OTP? */}
            {timer === 0 && (
              <View
                style={{
                  marginTop: verticalScale(20),
                }}
              >
                <Text
                  textAlign={"center"}
                  color={"#949494"}
                  fontWeight="500"
                  fontFamily={Fonts.POPPINS_MEDIUM}
                >
                  {t("trouble_receiving_otp")}
                </Text>

                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    color={"#949494"}
                    fontWeight="500"
                    fontFamily={Fonts.POPPINS_MEDIUM}
                  >
                    Contact
                  </Text>
                  <TouchableOpacity style={{ flexDirection: "row" }}>
                    <Text
                      color={"PRIMARY_COLOR"}
                      fontFamily={Fonts.POPPINS_MEDIUM}
                    >
                      {" "}
                      {t("help_center")}
                    </Text>
                  </TouchableOpacity>

                  {isAlternativeOptionAvailable() && (
                    <>
                      <Text> </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          color={"#949494"}
                          fontWeight="500"
                          fontFamily={Fonts.POPPINS_MEDIUM}
                        >
                          {t("receive_otp_via")}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            const oppositeType =
                              verificationType === "email" ? "phone" : "email";
                            navigation.setParams({
                              verificationType: oppositeType,
                            });
                            sendVerificationCodeTo(oppositeType);
                            setTimer(10);
                          }}
                        >
                          <Text
                            color={"PRIMARY_COLOR"}
                            fontFamily={Fonts.POPPINS_MEDIUM}
                          >
                            {" "}
                            {verificationType === "email"
                              ? t("phone")
                              : t("email")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {isSendingOTP ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={deepSkyBlue} size={"large"} />
        </View>
      ) : (
        <View>
          <View>
            {/* Buttons to verify and resend*/}
            <View style={{ flexDirection: "column" }}>
              {timer === 0 && (
                <Button
                  variant="outline"
                  _loading={{
                    _text: {
                      color: deepSkyBlue,
                      fontFamily: Fonts.POPPINS_SEMI_BOLD,
                    },
                  }}
                  _text={{
                    color: deepSkyBlue,
                    fontFamily: Fonts.POPPINS_MEDIUM,
                  }}
                  _spinner={{
                    color: deepSkyBlue,
                  }}
                  _pressed={{
                    backgroundColor: "DISABLED_COLOR",
                  }}
                  spinnerPlacement="end"
                  size={"lg"}
                  mt={verticalScale(50)}
                  p={"4"}
                  borderRadius={16}
                  borderColor={deepSkyBlue}
                  borderWidth={2}
                  isDisabled={loading}
                  isPressed={loading}
                  onPress={() => {
                    sendVerificationCodeTo(verificationType);
                    setTimer(60);
                  }}
                >
                  {t("resend_now")}
                </Button>
              )}
              <Button
                isLoading={loading}
                variant="solid"
                _loading={{
                  _text: {
                    color: "BLACK_COLOR",
                    fontFamily: Fonts.POPPINS_SEMI_BOLD,
                  },
                }}
                _text={{
                  color: "WHITE_COLOR",
                  fontFamily: Fonts.POPPINS_MEDIUM,
                }}
                _spinner={{
                  color: "BLACK_COLOR",
                }}
                _pressed={{
                  backgroundColor: "DISABLED_COLOR",
                }}
                spinnerPlacement="end"
                backgroundColor={"PRIMARY_COLOR"}
                size={"lg"}
                mt={verticalScale(timer === 0 ? 10 : 50)}
                p={"4"}
                borderRadius={16}
                isDisabled={loading}
                isPressed={loading}
                onPress={() => {
                  // otp Verification
                }}
              >
                {t("verify")}
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: newColorTheme.WHITE_COLOR,
    paddingHorizontal: horizontalScale(28),
    paddingVertical: verticalScale(30),
  },

  otpContainer: {
    marginHorizontal: horizontalScale(5),
    marginTop: verticalScale(35),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
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
  forgotButton: {
    height: verticalScale(6),
    borderRadius: 8,
    marginHorizontal: 20,
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  resend: {
    backgroundColor: Colors.PRIMARY_COLOR,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 5,
  },
});

export default AccountVerificationScreen;
