import {
  StyleSheet,
  StatusBar,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { View, Text, Toast } from "native-base";
import { Fonts } from "../../constants";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { StackActions } from "@react-navigation/native";
import { deepSkyBlue, newColorTheme } from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import OTPBox, { OTP } from "../../components/OTPBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigators/stack-navigator/AuthStack";
import AppBar from "../../components/AppBar";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import useAxios from "../../hooks/useAxios";
import { formatTime } from "../../utilities/helper-functions";

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

  const [sendCodeResponse, sendVerificationCode] = useAxios("/otp", "post");
  const [codeVerificationResponse, verifyCode] = useAxios(
    "/otp/verify",
    "post",
    {
      "No OTP exists for the provided phone number":
        "Verification failed.\nPlease ensure you have entered the correct OTP.",
      "The OTP has expired. Please request a new OTP.":
        "The OTP has expired.\nPlease click `Resend Now` to request a new one.",
    }
  );
  const [signupResponse, signup] = useAxios("/auth/signup", "post");
  const [loginResponse, login] = useAxios("/auth/login", "post");

  const abortControllerRef = useRef<AbortController | null>(null);

  const [isSendingOTP, setSendingOTP] = useState(true);

  const [timer, setTimer] = useState(10);
  const [restart, setRestart] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [verifying, setVerifying] = useState(false);

  const areBoxesFilled = () => Object.values(OTP).join("").length === 5;

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

  const sendVerificationCodeTo = async (type: VerificationType) => {
    setSendingOTP(true);
    let data = type === "email" ? { email: email } : { phone: phone };
    abortControllerRef.current = sendVerificationCode({ data: data });
  };

  useEffect(() => {
    sendVerificationCodeTo(verificationType);
  }, []);

  const handleOTPVerification = () => {
    Keyboard.dismiss();
    const code = Object.values(OTP).join("");
    if (code.length < 5) {
      Toast.show({ title: "Please enter otp" });
    } else {
      setVerifying(true);
      const data =
        verificationType == "email"
          ? {
              email: email,
              otpCode: code,
            }
          : {
              phone: phone,
              otpCode: code,
            };
      abortControllerRef.current = verifyCode({ data: data });
    }
  };

  useEffect(() => {
    if (sendCodeResponse === null) {
      navigation.goBack();
    }

    if (sendCodeResponse) {
      console.log(`OTP Response: ${JSON.stringify(sendCodeResponse)}`);
      setSendingOTP(false);
      setRestart((it) => it + 1);
    }
  }, [sendCodeResponse]);

  useEffect(() => {
    console.log(codeVerificationResponse);
    if (codeVerificationResponse === null) {
      setVerifying(false);
    }

    if (codeVerificationResponse) {
      if (transferrableValues !== undefined) {
        abortControllerRef.current = signup({
          data: {
            ...transferrableValues,
            dob: new Date(transferrableValues.dob),
          },
        });
      } else {
        // Forgot Password
        navigation.replace("NewPassword", {
          emailOrPhone: verificationType === "email" ? email! : phone!,
        });
      }
    }
  }, [codeVerificationResponse]);

  useEffect(() => {
    if (signupResponse === null) {
      setVerifying(false);
    }

    if (signupResponse) {
      AsyncStorage.getItem("fcmToken").then((token: any) => {
        const data = {
          email: transferrableValues!.email,
          password: transferrableValues!.password,
          fcmToken: JSON.parse(token),
        };
        abortControllerRef.current = login({ data: data });
      });
    }
  }, [signupResponse]);

  useEffect(() => {
    if (loginResponse === null) {
      setVerifying(false);
    }

    if (loginResponse) {
      const loginUserDataString = JSON.stringify(loginResponse);
      AsyncStorage.setItem("loginUserData", loginUserDataString).then(() => {
        // TODO(Khuram): Fix this navigation function calling.
        navigation.dispatch(
          StackActions.replace("BottomNavigator", {
            screen: "HomeScreen",
            params: {
              screenName: "Signup",
              show: true,
            },
          })
        );
      });
    }
  }, [loginResponse]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

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
                readonly={verifying}
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="first"
                next={secondInput}
                ref={firstInput}
              />
              <OTPBox
                readonly={verifying}
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="second"
                previous={firstInput}
                next={thirdInput}
                ref={secondInput}
              />
              <OTPBox
                readonly={verifying}
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="third"
                previous={secondInput}
                next={fourthInput}
                ref={thirdInput}
              />
              <OTPBox
                readonly={verifying}
                otp={OTP}
                onChange={(it) => setOTP(it)}
                index="fourth"
                previous={thirdInput}
                next={fifthInput}
                ref={fourthInput}
              />
              <OTPBox
                readonly={verifying}
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
                          disabled={verifying}
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
                            color={verifying ? "#404040" : "PRIMARY_COLOR"}
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
                <SecondaryButton
                  text={t("resend_now")}
                  isDisabled={verifying}
                  isLoading={false}
                  onClick={() => {
                    sendVerificationCodeTo(verificationType);
                    setTimer(60);
                  }}
                  props={{
                    mt: verticalScale(50),
                  }}
                />
              )}
              <PrimaryButton
                text={t("verify")}
                isLoading={verifying}
                onClick={handleOTPVerification}
                props={{
                  mt: verticalScale(timer === 0 ? 10 : 50),
                }}
                isDisabled={!areBoxesFilled()}
              />
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
});

export default AccountVerificationScreen;
