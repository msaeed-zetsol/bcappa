import {
  StyleSheet,
  StatusBar,
  TextInput,
  Keyboard,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { View, Pressable, Heading, Text, Button } from "native-base";
import { Colors, Images, Fonts } from "../../constants";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import {
  CommonActions,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { deepSkyBlue, newColorTheme } from "../../constants/Colors";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks/hooks";
import OTPBox, { OTP } from "../../components/OTPBox";

const OtpAccountVerification = () => {
  const routes: any = useRoute();
  const { data, show, from, hide } = routes.params;

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [shows, setShows] = useState(show);
  const [timer, setTimer] = useState(60);
  const [resendNow, setResendNow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whatTosend, setWhatToSend] = useState("phoneNumber");
  const { t } = useTranslation();

  const firstInput = useRef<TextInput>(null);
  const secondInput = useRef<TextInput>(null);
  const thirdInput = useRef<TextInput>(null);
  const fourthInput = useRef<TextInput>(null);
  const fifthInput = useRef<TextInput>(null);

  //time format function

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    // Add leading zero if necessary
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    if (minutes === 0 && seconds === 0) {
      return "00:00";
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  //verify Otp
  const LoginHandler = async (details: any) => {
    const getToken: any = await AsyncStorage.getItem("fcmToken");
    const parsedFcmToken: any = await JSON.parse(getToken);

    Keyboard.dismiss();
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    const concatenatedOtp = Object.values(OTP).join("");

    const payloadData: any = {
      otpCode: concatenatedOtp,
      phone: data.phone,
    };

    if (whatTosend === "email") {
      payloadData.email = data.email;
      delete payloadData.phone;
    }

    const response = await apimiddleWare({
      url: "/otp/verify",
      method: "post",
      data: payloadData,
      reduxDispatch: dispatch,
      navigation,
    });

    if (response) {
      const response = await apimiddleWare({
        url: "/auth/signup",
        method: "post",
        data: data,
        reduxDispatch: dispatch,
        navigation,
      });
      if (response) {
        await LoginHandler(data);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const verifyToGivenInfo = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    const concatenatedOtp = Object.values(OTP).join("");

    if (data.email) {
      var payloadData: any = {
        otpCode: concatenatedOtp,
        email: data.email,
      };
    } else if (data.phone) {
      var payloadData: any = {
        otpCode: concatenatedOtp,
        phone: data.phone,
      };
    }

    const response = await apimiddleWare({
      url: "/otp/verify",
      method: "post",
      data: payloadData,
      reduxDispatch: dispatch,
      navigation,
    });

    if (response) {
      console.log({ response });
      setIsLoading(false);
      navigation.dispatch(
        CommonActions.navigate("NewPassword", {
          data,
        })
      );
    }

    setIsLoading(false);
  };

  const sendOtp = async () => {
    console.log({ data });
    const response = await apimiddleWare({
      url: "/otp",
      method: "post",
      data: {
        phone: data.phone,
      },
      reduxDispatch: dispatch,
      navigation,
    });

    console.log(`Account Verification: ${JSON.stringify(response)}`);
  };

  const sendOtpViaEmail = async () => {
    const response = await apimiddleWare({
      url: "/otp",
      method: "post",
      data: {
        email: data.email,
      },
      reduxDispatch: dispatch,
      navigation,
    });
    if (response) {
      setWhatToSend("email");
    }
  };

  const sendOtpToGivenInfo = async () => {
    if (data.phone) {
      await sendOtp();
    } else if (data.email) {
      sendOtpViaEmail();
    }
  };

  useEffect(() => {
    from === "Signup" && sendOtp();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setResendNow(true);
      setShows(false);
    }
    const interval = setInterval(() => {
      setTimer((prevTimer: any) => prevTimer - 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, [timer]);

  const [OTP, setOTP] = useState<OTP>({
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
  });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={newColorTheme.WHITE_COLOR}
        barStyle={"dark-content"}
      />

      <Pressable onPress={() => navigation.goBack()}>
        <Images.BackButton
          style={{
            transform: [{ rotateY: I18nManager.isRTL ? "180deg" : "0deg" }],
          }}
        />
      </Pressable>

      <Heading mt={10} fontSize={"3xl"} fontFamily={Fonts.POPPINS_EXTRA_BOLD}>
        {t("account_verification")}
      </Heading>

      <Text
        fontSize={"sm"}
        mt={2}
        color={"#949494"}
        fontWeight="500"
        fontFamily={Fonts.POPPINS_MEDIUM}
      >
        {t("enter_4_digit_code_sent")}{" "}
        <Text color={"BLACK_COLOR"}>{data.phone || data.email}</Text>
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

      <View alignItems="center" mt={verticalScale(15)}>
        {!resendNow && (
          <Text color={"BLACK_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
            {t("resend_code_in")}{" "}
            <Text color={"PRIMARY_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
              {formatTime(timer)}
            </Text>
          </Text>
        )}
      </View>

      {!shows && !hide && (
        <View
          flexDirection={"row"}
          flexWrap={"wrap"}
          flex={1}
          alignItems={"center"}
          mt={3}
          alignSelf={"center"}
          justifyContent={"center"}
        >
          <Text
            textAlign={"center"}
            color={"#949494"}
            fontWeight="500"
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {t("trouble_receiving_otp")}
          </Text>
          <TouchableOpacity>
            <Text color={"PRIMARY_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
              {" "}
              {t("help_center")}
            </Text>
          </TouchableOpacity>
          <Text
            textAlign={"center"}
            color={"#949494"}
            fontWeight="500"
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {t("receive_otp_via")}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setResendNow(false);
              setShows(true);
              setTimer(60);
              sendOtpViaEmail();
            }}
          >
            <Text color={"PRIMARY_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
              {" "}
              {t("email")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flexDirection: "column" }}>
        {resendNow && (
          <Button
            isLoading={isLoading}
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
            isDisabled={isLoading}
            isPressed={isLoading}
            onPress={() => {
              setResendNow(false);
              setTimer(60);
              from === "forgot" ? sendOtpToGivenInfo() : sendOtp();
            }}
          >
            {t("resend_now")}
          </Button>
        )}
        <Button
          isLoading={isLoading}
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
          mt={verticalScale(resendNow ? 10 : 50)}
          p={"4"}
          borderRadius={16}
          isDisabled={isLoading}
          isPressed={isLoading}
          onPress={() => {
            from === "forgot" ? verifyToGivenInfo() : verifyOtp();
          }}
        >
          {t("verify")}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default OtpAccountVerification;
