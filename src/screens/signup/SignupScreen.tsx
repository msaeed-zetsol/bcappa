import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  I18nManager,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Fonts, Images } from "../../constants";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
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
  Toast,
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
import { apimiddleWare } from "../../utilities/helper-functions";
import CheckBox from "@react-native-community/checkbox";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apply } from "../../utilities/scope-functions";
import { useTranslation } from "react-i18next";
import globalStyles from "../../styles/global";
import { useAppDispatch } from "../../hooks/hooks";
import CountryCodePicker from "../../components/CountryCodePicker";
import Message from "../../components/AlertMessage";
import AppBar from "../../components/AppBar";
import { setMembers } from "../../redux/members/membersSlice";
import useAxios from "../../hooks/useAxios";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { AuthStackParamList } from "../../navigators/StackNavigator/AuthStack";
import PrimaryButton from "../../components/PrimaryButton";

type SignUpScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "SignupScreen"
>;

const SignupScreen = ({ navigation }: SignUpScreenProps) => {
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [countryCode, setCountryCode] = useState("+92");
  const [hasAgreed, toggleHasAgreed] = useState(false);

  const [showDateError, setShowDateError] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);

  const getMaximumDate = (): Date => {
    return apply(new Date(), (date) => {
      date.setFullYear(date.getFullYear() - 18);
    });
  };

  const [selectedDate, setSelectedDate] = useState(getMaximumDate());

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    getValues,
  } = useForm<SignupFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cnic: "",
      password: "",
      gender: "",
      role: "customer",
      dob: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
    criteriaMode: "firstError",
  });

  const [data, start] = useAxios<MessageResponse>(
    "/auth/verify-credentials",
    "post",
    {
      "Email already Exits.":
        "Sorry, an account with the provided information already exists. Please try logging in.",
      "Phone already Exits.":
        "Sorry, an account with the provided information already exists. Please try logging in.",
      "Cnic already Exits.":
        "Sorry, an account with the provided information already exists. Please try logging in.",
    }
  );

  const handleSignup = async (formValues: SignupFormValues) => {
    start({
      data: {
        email: formValues.email,
        phone: countryCode + formValues.phone,
        cnic: formValues.cnic,
      },
    });
  };

  useEffect(() => {
    if (data === null) {
      setLoading(false);
    }

    if (data && data.message === "Success") {
      const values = {
        ...getValues(),
        phone: countryCode + getValues().phone,
      } as SignupFormValues;

      navigation.navigate("AccountVerificationScreen", {
        email: values.email,
        phone: values.phone,
        verificationType: "phone",
        transferrableValues: values,
      });
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      reset({
        fullName: "",
        email: "",
        phone: "",
        cnic: "",
        password: "",
        gender: "",
      });
    };
  }, []);

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

  return (
    <View style={styles.container}>
      <Message
        Photo={() => <Images.AccountNotVerified />}
        message={t("please_read_terms_and_conditions_and_privacy_policy")}
        buttonText={t("ok")}
        callback={() => setShowAgreementError(false)}
        secondButtonText={t("cancel")}
        secondCallback={() => setShowAgreementError(false)}
        show={showAgreementError}
      />

      <Message
        Photo={() => <Images.AccountNotVerified />}
        message={t("please_select_your_date_of_birth")}
        buttonText={t("ok")}
        callback={() => setShowDateError(false)}
        secondButtonText={t("cancel")}
        secondCallback={() => setShowDateError(false)}
        show={showDateError}
      />

      <CountryCodePicker
        visible={showCountryCodePicker}
        onDismiss={() => setShowCountryCodePicker(false)}
        onPicked={(item) => {
          setCountryCode(item.dial_code);
          setShowCountryCodePicker(false);
        }}
      />

      {showDatePickerModal && (
        <DateTimePicker
          value={selectedDate}
          mode={"date"}
          display="default"
          maximumDate={getMaximumDate()}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setShowDatePickerModal(false);
            if (event.type === "set") {
              if (date) {
                setValue("dob", date.toLocaleDateString());
                setSelectedDate(date);
              }
            }
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
        style={{ marginHorizontal: horizontalScale(28) }}
      />

      <Text
        color="GREY"
        fontSize="md"
        letterSpacing="0.32"
        mt={verticalScale(25)}
        mb={verticalScale(8)}
        style={{
          paddingHorizontal: horizontalScale(28),
        }}
        fontFamily={Fonts.POPPINS_MEDIUM}
      >
        {t("it_only_takes_a_minute_create_account")}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: horizontalScale(28),
        }}
      >
        <Box mt={verticalScale(10)}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextFieldComponent
                isDisabled={loading}
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
                  isDisabled={loading}
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
              <Text style={globalStyles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
                  isDisabled={loading}
                  placeholder={t("phone_number")}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  maxLength={10}
                  keyboardType={"number-pad"}
                  InputLeftElement={
                    <Pressable
                      isDisabled={loading}
                      onPress={() => setShowCountryCodePicker(true)}
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      ml="6"
                    >
                      <Text fontSize={"sm"} fontFamily={Fonts.POPPINS_REGULAR}>
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
              name="phone"
              rules={{
                required: t("phone_is_required"),
                minLength: {
                  value: 10,
                  message: t("phone_is_invalid"),
                },
              }}
              defaultValue=""
            />
            {errors.phone && (
              <Text style={globalStyles.errorText}>
                {errors.phone?.message}
              </Text>
            )}
          </View>

          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
                  isDisabled={loading}
                  placeholder={t("cnic_no")}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  keyboardType={"number-pad"}
                  maxLength={13}
                />
              )}
              name="cnic"
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
            {errors.cnic && (
              <Text style={globalStyles.errorText}>{errors.cnic.message}</Text>
            )}
          </View>

          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  isDisabled={loading}
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
                  _actionSheet={{ disableOverlay: true }}
                  _actionSheetContent={{}}
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
            {errors.gender && (
              <Text style={globalStyles.errorText}>
                {errors.gender.message}
              </Text>
            )}
          </View>

          <View mt={verticalScale(15)}>
            <Controller
              rules={{ required: "Date of bith is required." }}
              name="dob"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <TouchableOpacity
                    disabled={loading}
                    onPress={() => setShowDatePickerModal(true)}
                  >
                    <TextFieldComponent
                      isDisabled={loading}
                      placeholder={t("date_of_birth")}
                      value={value}
                      readOnly={true}
                      InputRightElement={
                        <Pressable onPress={() => setShowDatePickerModal(true)}>
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
                );
              }}
            />
            {errors.dob && (
              <Text style={globalStyles.errorText}>{errors.dob.message}</Text>
            )}
          </View>

          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
                  isDisabled={loading}
                  placeholder={t("password")}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  type={showPassword ? "text" : "password"}
                  InputRightElement={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Icon
                        as={
                          <MaterialIcons
                            name={
                              showPassword ? "visibility" : "visibility-off"
                            }
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
        </Box>

        <View mt={3} flexDirection={"row"} alignItems={"center"} flex={1}>
          <CheckBox
            disabled={loading}
            value={hasAgreed}
            onValueChange={(newValue) => toggleHasAgreed(newValue)}
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

        <PrimaryButton
          isLoading={loading}
          isDisabled={!isValid || !hasAgreed}
          text={t("sign_up")}
          props={{ mt: verticalScale(50) }}
          onClick={() => {
            setLoading(true);
            handleSubmit(handleSignup)();
          }}
        />

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
            disabled={loading}
            style={[
              styles.googleButton,
              loading ? styles.inactiveGoogleButton : styles.activeGoogleButton,
            ]}
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

{
  /* <Pressable
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
          </Pressable> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: newColorTheme.WHITE_COLOR,
    paddingVertical: verticalScale(8),
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
  },
  activeGoogleButton: {
    backgroundColor: "transparent",
    borderColor: "#CCCCCC",
  },
  inactiveGoogleButton: {
    backgroundColor: "#e8e8e8",
    borderColor: "#e8e8e8",
  },
});

export default SignupScreen;
