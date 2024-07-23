import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  I18nManager,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Fonts, Images } from "../../constants";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import { CountryPicker } from "react-native-country-codes-picker";
import { useForm, Controller } from "react-hook-form";
import {
  Text,
  Box,
  FormControl,
  Pressable,
  Icon,
  Button,
  View,
  Select,
} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors, { newColorTheme } from "../../constants/Colors";

import {
  CommonActions,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import TextFieldComponent from "../../components/TextFieldComponent";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import CheckBox from "@react-native-community/checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { locationPermission } from "../../service/LocationService";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apply } from "../../scope-functions";
import { useTranslation } from "react-i18next";
import globalStyles from "../../styles/global";
import { useAppDispatch } from "../../hooks/hooks";
import CountryCodePicker from "../../components/CountryCodePicker";
import Message from "../../components/AlertMessage";
import AppBar from "../../components/AppBar";
import { setMembers } from "../../redux/members/membersSlice";

const SignupScreen = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDate, setShowDate] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      cnicNumber: "",
      password: "",
      gender: "",
    },
  });

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

  const signupHandler = async (details: any) => {
    setIsLoading(true);

    const getCred = await verifyCredentials(details);
    setIsLoading(false);

    if (showDate && toggleCheckBox && getCred.message === "Success") {
      if (!details.gender) {
        // Use the error message for gender validation from the useForm hook
        console.log(errors.gender); // Log the error object for reference
        return;
      }

      const data = {
        fullName: details.fullName,
        email: details.email,
        phone: countryCode + details.phoneNumber,
        cnic: details.cnicNumber,
        dob: date,
        gender: details.gender,
        password: details.password,
        role: "customer",
      };

      navigation.dispatch(
        CommonActions.navigate("OtpAccountVerification", {
          data: data,
          show: true,
          from: "Signup",
          hide: false,
        })
      );
    } else {
      if (!showDate) {
        setModalVisible(true);
      } else if (!toggleCheckBox) {
        setModalVisible(true);
      }
    }
  };

  const verifyCredentials = async (details: any) => {
    const data = {
      email: details.email,
      phone: countryCode + details.phoneNumber,
      cnic: details.cnicNumber,
    };

    const response = await apimiddleWare({
      url: "/auth/verify-credentials",
      method: "post",
      data: data,
      reduxDispatch: dispatch,
      navigation,
    });

    if (response) {
      return response;
    }
  };

  useEffect(() => {
    return () => {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        cnicNumber: "",
        password: "",
      });
    };
  }, []);

  const getMaximumDate = (): Date => {
    return apply(new Date(), (date) => {
      date.setFullYear(date.getFullYear() - 18);
    });
  };

  return (
    <View style={styles.container}>
      {!toggleCheckBox && (
        <Message
          Photo={() => <Images.AccountNotVerified />}
          message={t("please_read_terms_and_conditions_and_privacy_policy")}
          buttonText={t("ok")}
          callback={() => setModalVisible(false)}
          secondButtonText={t("cancel")}
          secondCallback={() => setModalVisible(false)}
          show={modalVisible}
        />
      )}
      {!showDate && (
        <Message
          Photo={() => <Images.AccountNotVerified />}
          message={t("please_select_your_date_of_birth")}
          buttonText={t("ok")}
          callback={() => setModalVisible(false)}
          secondButtonText={t("cancel")}
          secondCallback={() => setModalVisible(false)}
          show={modalVisible}
        />
      )}
      <CountryCodePicker
        visible={showCountryCodePicker}
        onDismiss={() => setShowCountryCodePicker(false)}
        onPicked={(item) => {
          setCountryCode(item.dial_code);
          setShowCountryCodePicker(false);
        }}
      />

      {openDate && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode={"date"}
          display="default"
          maximumDate={getMaximumDate()}
          onChange={(event: any, selectedDate?: Date) => {
            setOpenDate(false);
            if (selectedDate) {
              setDate(selectedDate);
              setShowDate(selectedDate.toLocaleDateString());
            }
          }}
          onTouchCancel={() => {
            setOpenDate(false);
          }}
          style={{ flex: 1, backgroundColor: "red" }}
          positiveButton={{ label: "OK", textColor: Colors.PRIMARY_COLOR }}
          negativeButton={{ label: "Cancel", textColor: Colors.PRIMARY_COLOR }}
        />
      )}
    <AppBar
        name={t("sign_up")}
        onPress={() => {
          dispatch(setMembers([]));
          navigation.goBack();
        }}
      />
      <Text
        color="GREY"
        fontSize="md"
        letterSpacing="0.32"
        mt={verticalScale(10)}
        fontFamily={Fonts.POPPINS_MEDIUM}
      >
        {t("it_only_takes_a_minute_create_account")}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box mt={verticalScale(20)}>
          <FormControl mt={verticalScale(5)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
                  placeholder={t("full_name")}
                  onBlur={onBlur}
                  onChange={onChange}
                  keyboardType={"ascii-capable"}
                  value={value}
                />
              )}
              name="fullName"
              rules={{
                required: t("full_name_is_required"),
              }}
              defaultValue=""
            />
            {errors.fullName && (
              <Text style={globalStyles.errorText}>
                {t("full_name_is_required")}
              </Text>
            )}
            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextFieldComponent
                    placeholder={t("email_id")}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    keyboardType={"email-address"}
                  />
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
                <Text style={globalStyles.errorText}>
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextFieldComponent
                    placeholder={t("phone_number")}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    maxLength={10}
                    keyboardType={"number-pad"}
                    InputLeftElement={
                      <Pressable
                        onPress={() => setShowCountryCodePicker(true)}
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        ml="6"
                      >
                        <Text
                          fontSize={"sm"}
                          fontFamily={Fonts.POPPINS_REGULAR}
                        >
                          {countryCode}
                        </Text>
                        <Icon
                          as={<Ionicons name={"caret-down"} />}
                          size={5}
                          ml="2"
                          color="BLACK_COLOR"
                        />
                        <View
                          borderWidth={0.5}
                          borderColor={"BORDER_COLOR"}
                          height={5}
                          ml={2}
                        />
                      </Pressable>
                    }
                  />
                )}
                name="phoneNumber"
                rules={{
                  required: t("phone_is_required"),
                }}
                defaultValue=""
              />
              {errors.phoneNumber && (
                <Text style={globalStyles.errorText}>
                  {t("phone_is_required")}
                </Text>
              )}
            </View>

            {/*  nic*/}
            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextFieldComponent
                    placeholder={t("cnic_no")}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    keyboardType={"number-pad"}
                    maxLength={13}
                  />
                )}
                name="cnicNumber"
                rules={{
                  required: t("cnic_is_required"),
                  minLength: {
                    value: 13,
                    message: t("cnic_must_be_13_digits_long"),
                  },
                  maxLength: {
                    value: 13,
                    message: t("cnic_must_be_13_digits_long"),
                  },
                }}
                defaultValue=""
              />
              {errors.cnicNumber && (
                <Text style={globalStyles.errorText}>
                  {errors.cnicNumber.message}
                </Text>
              )}
            </View>
            <View mt={verticalScale(15)}>
              <FormControl borderRadius={16} isReadOnly>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      style={{ marginStart: 8 }}
                      padding={3}
                      selectedValue={value}
                      borderRadius={16}
                      placeholderTextColor={"GREY"}
                      color={"BLACK_COLOR"}
                      fontSize={"sm"}
                      fontFamily={Fonts.POPPINS_REGULAR}
                      accessibilityLabel={t("select_gender")}
                      dropdownIcon={
                        <Icon
                          as={<Ionicons name={"caret-down"} />}
                          size={5}
                          mr={5}
                          color="BLACK_COLOR"
                        />
                      }
                      placeholder={t("select_gender")}
                      onValueChange={(itemValue) => onChange(itemValue)}
                    >
                      <Select.Item label={t("male")} value="male" />
                      <Select.Item label={t("female")} value="female" />
                      <Select.Item label={t("other")} value="other" />
                    </Select>
                  )}
                  name="gender"
                  rules={{ required: t("gender_is_required") }}
                />
              </FormControl>
              {errors.gender && (
                <Text style={globalStyles.errorText}>
                  {errors.gender.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setOpenDate(true)}
              style={{ marginTop: verticalScale(15) }}
            >
              <TextFieldComponent
                placeholder={t("date_of_birth")}
                value={showDate}
                readOnly={true}
                InputRightElement={
                  <Pressable onPress={() => setOpenDate(true)}>
                    <Icon
                      as={<Ionicons name={"calendar"} />}
                      size={5}
                      mr="5"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
            </TouchableOpacity>
            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextFieldComponent
                    placeholder={t("password")}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    type={show ? "text" : "password"}
                    InputRightElement={
                      <Pressable onPress={() => setShow(!show)}>
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? "visibility" : "visibility-off"}
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
                defaultValue=""
              />
              {errors.password && (
                <Text style={globalStyles.errorText}>
                  {errors.password.message}
                </Text>
              )}
            </View>
          </FormControl>
        </Box>
        <View mt={3} flexDirection={"row"} alignItems={"center"} flex={1}>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
            tintColors={{ true: Colors.PRIMARY_COLOR, false: Colors.GREY }}
          />
          <View
            flexDirection={"row"}
            flexWrap={"wrap"}
            flex={1}
            alignItems={"center"}
            ml={1}
          >
            <Text style={{ marginEnd: 1 }}>{t("agree_to_appa")}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(
                  CommonActions.navigate("TermsAndConditions", {
                    name: "Terms And Condition",
                  })
                );
              }}
            >
              <Text color={"PRIMARY_COLOR"} style={{ marginStart: 1 }}>
                {t("terms_of_service")}
              </Text>
            </TouchableOpacity>
            <Text> {t("and")} </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(
                  CommonActions.navigate("TermsAndConditions", {
                    name: "Privacy Policy",
                  })
                );
              }}
            >
              <Text color={"PRIMARY_COLOR"} style={{ marginStart: 1 }}>
                {t("privacy_policy")}{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          isLoading={isLoading}
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
          isPressed={isLoading}
          onPress={handleSubmit(signupHandler)}
        >
          {t("sign_up")}
        </Button>
        <View width={"100%"} justifyContent={"center"} mt={verticalScale(25)}>
          <View borderWidth={0.5} borderColor={"BORDER_COLOR"} />
          <View position={"absolute"} flexWrap={"wrap"} alignSelf="center">
            <Text
              textAlign={"center"}
              bg={"WHITE_COLOR"}
              color="GREY"
              width="100%"
              alignSelf="center"
              px="3"
              fontFamily={Fonts.POPPINS_REGULAR}
            >
              {t("or_continue_with")}
            </Text>
          </View>
        </View>
        <View
          width={"100%"}
          height={100}
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
              pr="2"
              fontSize={verticalScale(16)}
              textAlign={"center"}
              fontFamily={Fonts.POPPINS_MEDIUM}
            >
              {t("google")}
            </Text>
          </Pressable>
          {/* <Pressable
            style={styles.socialButton}
            _pressed={{
              backgroundColor: "DISABLED_COLOR",
            }}
          >
            <Images.Facebook />
            <Text
              pl="2"
              pr="2"
              fontSize={verticalScale(16)}
              fontFamily={Fonts.POPPINS_MEDIUM}
            >
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
            {t("already_registered")}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text
              color={"PRIMARY_COLOR"}
              letterSpacing={0.3}
              fontFamily={Fonts.POPPINS_MEDIUM}
              ml={1}
            >
              {t("sign_in")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
  },
});

export default SignupScreen;
