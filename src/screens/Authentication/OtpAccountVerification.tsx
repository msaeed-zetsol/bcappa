import {
  StyleSheet,
  StatusBar,
  TextInput,
  Keyboard,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { View, Pressable, Heading, Text, Button } from 'native-base';
import { Colors, Images, Fonts } from '../../constants';
import { horizontalScale, verticalScale } from '../../utilities/Dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { newColorTheme } from '../../constants/Colors';
import { apimiddleWare } from '../../utilities/HelperFunctions';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

const OtpAccountVerification = () => {
  const routes: any = useRoute();
  const { data, show, from, hide } = routes.params;
  const [otp, setOtp] = useState({ 1: "", 2: "", 3: "", 4: "", 5: "" });
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();
  const firstInput: any = useRef();
  const secondInput: any = useRef();
  const thirdInput: any = useRef();
  const fourthInput: any = useRef();
  const fifthInput: any = useRef();
  const [shows, setShows] = useState(show);
  const [timer, setTimer] = useState<any>(60);
  const [resendNow, setResendNow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whatTosend, setWhatToSend] = useState("phoneNumber");
  const { t } = useTranslation();

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
    console.log(details);
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
      console.log(response);
      if (response) {
        const loginUserDataString = await JSON.stringify(response);
        await AsyncStorage.setItem("loginUserData", loginUserDataString);
        // await requestUserPermission();
        navigation.replace("BottomNavigator", {
          screen: "HomeScreen",
          params: {
            screenName: "Signup",
            show: true,
          },
        });
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
    const concatenatedOtp = Object.values(otp).join("");
    console.log({ whatTo: whatTosend });

    const payloadData: any = {
      otpCode: concatenatedOtp,
      phoneNumber: data.phone,
    };

    if (whatTosend === "email") {
      payloadData.email = data.email;
      delete payloadData.phoneNumber;
    }

    console.log({ payloadData });

    const response = await apimiddleWare({
      url: "/otp/verify",
      method: "post",
      data: payloadData,
      reduxDispatch: dispatch,
      navigation,
    });
    console.log({ apikbad: data });
    console.log({ response });
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
    const concatenatedOtp = Object.values(otp).join("");

    if (data.email) {
      var payloadData: any = {
        otpCode: concatenatedOtp,
        email: data.email,
      };
    } else if (data.phone) {
      var payloadData: any = {
        otpCode: concatenatedOtp,
        phoneNumber: data.phone,
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
      navigation.navigate("NewPassword", {
        data,
      });
    }
    setIsLoading(false);
  };

  const sendOtp = async () => {
    console.log({ data });
    const response = await apimiddleWare({
      url: "/otp",
      method: "post",
      data: {
        phoneNumber: data.phone,
      },
      reduxDispatch: dispatch,
      navigation,
    });
    if (response) {
      console.log({ response });
    }
  };
  const sendOtpViaEmail = async () => {
    console.log({ data });
    // setWhatToSend('email');
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

      console.log({ response });
    }
  };
  const sendOtpToGivenInfo = async () => {
    console.log({ data });
    if (data.phone) {
      await sendOtp();
    } else if (data.email) {
      sendOtpViaEmail();
    }
  };
  useEffect(() => {
    from === "forgot" ? sendOtpToGivenInfo() : sendOtp();
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
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={firstInput}
            onChangeText={(text) => {
              setOtp({ ...otp, 1: text });
              text ? secondInput.current.focus() : "";
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={secondInput}
            onChangeText={(text) => {
              setOtp({ ...otp, 2: text });
              text ? thirdInput.current.focus() : firstInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={thirdInput}
            onChangeText={(text) => {
              setOtp({ ...otp, 3: text });

              text ? fourthInput.current.focus() : secondInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={fourthInput}
            onChangeText={(text) => {
              setOtp({ ...otp, 4: text });
              text ? fifthInput.current.focus() : thirdInput.current.focus();
            }}
          />
        </View>
        <View style={styles.otpBox}>
          <TextInput
            style={styles.otpText}
            keyboardType="number-pad"
            maxLength={1}
            ref={fifthInput}
            onChangeText={(text) => {
              setOtp({ ...otp, 5: text });
              text ? Keyboard.dismiss() : fourthInput.current.focus();
            }}
          />
        </View>
      </View>
      <View alignItems="center" mt={15}>
        {!resendNow ? (
          <Text color={"BLACK_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
            {t("resend_code_in")}{" "}
            <Text color={"PRIMARY_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
              {formatTime(timer)}
            </Text>
          </Text>
        ) : (
          <Pressable
            style={styles.resend}
            onPress={() => {
              setResendNow(false);
              setTimer(60);
              from === "forgot" ? sendOtpToGivenInfo() : sendOtp();
            }}
          >
            <Text color={"WHITE_COLOR"} fontFamily={Fonts.POPPINS_MEDIUM}>
              {t("resend_now")}
            </Text>
          </Pressable>
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
        mt={verticalScale(50)}
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
  );
};

export default OtpAccountVerification;

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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  otpBox: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: verticalScale(12),
  },
  otpText: {
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: horizontalScale(4),
    paddingVertical: verticalScale(2),
    color: Colors.BLACK_COLOR,
    fontWeight: 'bold',
  },
  forgotButton: {
    height: verticalScale(6),
    borderRadius: 8,
    marginHorizontal: 20,
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  resend: {
    backgroundColor: Colors.PRIMARY_COLOR,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
    borderRadius: 5,
  },
});
