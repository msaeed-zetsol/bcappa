import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Images, Fonts } from "../../constants";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Text,
  Box,
  Input,
  FormControl,
  Pressable,
  Icon,
  Button,
  View,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  CommonActions,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { newColorTheme } from "../../constants/Colors";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestUserPermission } from "../../firebase/Notifications";
import { useDispatch } from "react-redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  LoginManager,
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk-next";
import { useAppDispatch } from "../../hooks/hooks";
import useAxios from "../../data/useAxios";

GoogleSignin.configure({
  webClientId:
    "425837288874-ivnre9s31uk6clo206fqaa8op0n5p5r3.apps.googleusercontent.com",
});

type LoginForm = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
    criteriaMode: "firstError",
  });

  const [data, start, loading] = useAxios("/auth/login", "post", {
    "Email or Password is Invalid.": "Incorrect Email or Password",
  });

  const login = async (loginDetails: LoginForm) => {
    Keyboard.dismiss();
    const token = await getFcmToken();
    start({
      data: {
        email: loginDetails.email,
        password: loginDetails.password,
        fcmToken: token,
      },
    });
  };

  const navigateToHome = async () => {
    await AsyncStorage.setItem("loginUserData", JSON.stringify(data));
    await requestUserPermission();
    navigation.dispatch(
      StackActions.replace("BottomNavigator", {
        screen: "HomeScreen",
        params: {
          screenName: "Login",
        },
      })
    );
  };

  useEffect(() => {
    if (data) {
      navigateToHome();
    }
  }, [data]);

  const getFcmToken = async () => {
    const fcmToken = await AsyncStorage.getItem("fcmToken");
    if (fcmToken) {
      return await JSON.parse(fcmToken);
    }
    return "";
  };

  // ------------------Login ---------------------//

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { user } = await GoogleSignin.signIn();
      const getToken: any = await AsyncStorage.getItem("fcmToken");
      const parsedFcmToken: any = await JSON.parse(getToken);

      const datas = {
        ...user,
        fcmToken: parsedFcmToken,
        role: "customer",
      };

      const response = await apimiddleWare({
        url: "/auth/login/google",
        method: "post",
        data: datas,
        reduxDispatch: dispatch,
        navigation: navigation,
      });

      if (response) {
        const loginUserDataString = JSON.stringify(response);
        await AsyncStorage.setItem("loginUserData", loginUserDataString);
        navigation.dispatch(
          StackActions.replace("BottomNavigator", {
            screen: "HomeScreen",
            params: {
              screenName: "Login",
            },
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =============Facebook login===============
  const facebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      console.log("result", result);
      if (result.isCancelled) {
        console.log("Login cancelled");
        return;
      }
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error("Something went wrong obtaining access token");
      }

      const responseInfoCallback = async (error: any, result: any) => {
        if (error) {
          console.log("Error fetching data:", error);
        } else {
          try {
            const getToken: any = await AsyncStorage.getItem("fcmToken");
            const parsedFcmToken: any = await JSON.parse(getToken);

            const datas = {
              ...result,
              fcmToken: parsedFcmToken,
              role: "customer",
            };

            const response = await apimiddleWare({
              url: "/auth/login/facebook",
              method: "post",
              data: datas,
            });

            if (response) {
              const loginUserDataString = JSON.stringify(response);
              await AsyncStorage.setItem("loginUserData", loginUserDataString);
              navigation.dispatch(
                StackActions.replace("BottomNavigator", {
                  screen: "HomeScreen",
                  params: {
                    screenName: "Login",
                  },
                })
              );
            }
          } catch (apiError) {
            console.log("Error in API call:", apiError);
          }
        }
      };

      const infoRequest = new GraphRequest(
        "/me",
        {
          accessToken: data.accessToken,
          parameters: {
            fields: {
              string: "id,name,email",
            },
          },
        },
        responseInfoCallback
      );

      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const logoutSocialLogIn = async () => {
    try {
      const data = await GoogleSignin.signOut();
      console.log({ data });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={newColorTheme.WHITE_COLOR}
        barStyle={"dark-content"}
      />
      <Text
        fontSize="3xl"
        color="BLACK_COLOR"
        mt="10"
        fontFamily={Fonts.POPPINS_SEMI_BOLD}
      >
        {t("welcome_back")}
      </Text>
      <Text
        color="GREY"
        fontSize="md"
        letterSpacing="0.32"
        mt={verticalScale(5)}
        fontFamily={Fonts.POPPINS_MEDIUM}
      >
        {t("sign_in_to_continue")}
      </Text>

      <Box mt={verticalScale(40)}>
        <FormControl w="100%">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Input
                  placeholder={t("email_id")}
                  w="100%"
                  size="lg"
                  borderRadius={16}
                  p="3"
                  pl="5"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  borderColor="BORDER_COLOR"
                  placeholderTextColor={"GREY"}
                  color={"BLACK_COLOR"}
                  fontFamily={Fonts.POPPINS_REGULAR}
                  fontSize={"sm"}
                  inputMode="email"
                />
              </View>
            )}
            name="email"
            rules={{
              required: t("email_is_required"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t("email_is_invalid"),
              },
            }}
            defaultValue=""
          />
          {errors.email && (
            <Text
              style={{ marginStart: 16, fontSize: 13 }}
              color={"ERROR"}
              marginTop={verticalScale(3)}
              fontFamily={Fonts.POPPINS_MEDIUM}
            >
              {errors.email.message}
            </Text>
          )}
        </FormControl>

        <FormControl w="100%">
          <Controller
            control={control}
            rules={{
              required: t("password_is_required"),
              minLength: {
                value: 8,
                message: t("password_length_must_be_greater_than_8"),
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: t("password_alpha_numeric_only"),
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={t("password")}
                w="100%"
                size="lg"
                borderRadius={16}
                p="3"
                pl="5"
                mt={verticalScale(25)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                type={showPassword ? "text" : "password"}
                borderColor="BORDER_COLOR"
                placeholderTextColor={"GREY"}
                color={"BLACK_COLOR"}
                fontSize={"sm"}
                fontFamily={Fonts.POPPINS_REGULAR}
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={showPassword ? "visibility" : "visibility-off"}
                        />
                      }
                      size={5}
                      mr="5"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text
              style={{ marginStart: 16, fontSize: 13 }}
              color={"ERROR"}
              marginTop={verticalScale(3)}
              fontFamily={Fonts.POPPINS_MEDIUM}
            >
              {errors.password.message}
            </Text>
          )}
        </FormControl>
      </Box>

      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(CommonActions.navigate("Forgot"));
        }}
      >
        <Text
          color="PRIMARY_COLOR"
          fontSize="sm"
          fontFamily={Fonts.POPPINS_REGULAR}
          letterSpacing="0.32"
          alignSelf="flex-end"
          mt={verticalScale(15)}
        >
          {t("forgot_password_question")}
        </Text>
      </TouchableOpacity>

      <Button
        isLoading={loading}
        variant="solid"
        _text={{
          color: "WHITE_COLOR",

          fontFamily: Fonts.POPPINS_SEMI_BOLD,
        }}
        _loading={{
          _text: {
            color: "BLACK_COLOR",
            fontFamily: Fonts.POPPINS_MEDIUM,
          },
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
        isPressed={loading}
        onPress={handleSubmit(login)}
      >
        {t("sign_in")}
      </Button>

      <View width={"100%"} justifyContent={"center"} mt={verticalScale(20)}>
        <View borderWidth={0.5} borderColor={"BORDER_COLOR"} />
        <View position={"absolute"} flexWrap={"wrap"} alignSelf="center">
          <Text
            textAlign={"center"}
            bg={"WHITE_COLOR"}
            color="GREY"
            width="100%"
            alignSelf="center"
            px="3"
          >
            {t("or")}
          </Text>
        </View>
      </View>

      <View
        width={"100%"}
        height={verticalScale(100)}
        mt={verticalScale(10)}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Pressable
          style={styles.socialButton}
          onPress={googleLogin}
          _pressed={{
            backgroundColor: "DISABLED_COLOR",
          }}
        >
          <Images.Google />
          <Text
            pl="2"
            fontSize={verticalScale(16)}
            textAlign={"center"}
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {t("google")}
          </Text>
        </Pressable>
        {/* <Pressable
          style={styles.socialButton}
          onPress={facebookLogin}
          // onPress={logoutSocialLogIn}
          _pressed={{
            backgroundColor: "DISABLED_COLOR",
          }}
        >
          <Images.Facebook />
          <Text
            pl="2"
            fontSize={verticalScale(16)}
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {" "}
            {t("facebook")}
          </Text>
        </Pressable> */}
      </View>
      <View
        alignItems={"center"}
        justifyContent={"center"}
        height={verticalScale(50)}
        flexDirection={"row"}
        alignSelf={"center"}
      >
        <Text
          color={"#5A5A5C"}
          letterSpacing={0.3}
          fontFamily={Fonts.POPPINS_MEDIUM}
        >
          {t("dont_have_an_account")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(CommonActions.navigate("SignupScreen"));
          }}
        >
          <Text
            color={"PRIMARY_COLOR"}
            letterSpacing={0.3}
            fontFamily={Fonts.POPPINS_MEDIUM}
            ml={1}
          >
            {t("sign_up")}
          </Text>
        </TouchableOpacity>
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
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 16,
    width: "100%",
    justifyContent: "center",
  },
});

export default LoginScreen;
