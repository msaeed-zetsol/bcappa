import { StyleSheet, View, I18nManager, Keyboard } from "react-native";
import { Text, FormControl, Button, Icon } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { newColorTheme } from "../../constants/Colors";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Pressable } from "native-base";
import { Fonts, Images } from "../../constants";
import { useForm, Controller } from "react-hook-form";
import TextFieldComponent from "../../components/TextFieldComponent";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import CountryCodePicker from "../../components/CountryCodePicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigators/stack-navigator/AuthStack";
import useAxios from "../../hooks/useAxios";
import PrimaryButton from "../../components/PrimaryButton";
import ValueToggle from "../../components/ValueToggle";
import globalStyles from "../../styles/global";

type ForgotPasswordProps = NativeStackScreenProps<AuthStackParamList, "Forgot">;

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordProps) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [isEmailSelected, setIsEmailSelected] = useState(true);
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: undefined,
      phone: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const [data, start] = useAxios<MessageResponse>("/auth/check-user", "post", {
    "phone must be a valid phone number": "Please enter a valid phone number",
    "User Does Not Exist.":
      "Sorry, no account found with the provided information",
  });

  const getPhoneValue = () => {
    const phone = getValues("phone");
    return phone !== undefined ? countryCode + phone : undefined;
  };

  useEffect(() => {
    if (data === null) {
      setLoading(false);
    }

    if (data && data.message === "Success") {
      navigation.navigate("AccountVerificationScreen", {
        email: getValues("email"),
        phone: getPhoneValue(),
        verificationType: isEmailSelected ? "email" : "phone",
      });
      setLoading(false);
    }
  }, [data]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const checkIfUserExists = async (details: ForgotPasswordFormValues) => {
    Keyboard.dismiss();
    setLoading(true);
    const data = isEmailSelected
      ? { email: details.email }
      : { phone: countryCode + details.phone };
    abortControllerRef.current = start({
      data: data,
    });
  };

  return (
    <View style={styles.container}>
      <CountryCodePicker
        visible={showCountryCodePicker}
        onDismiss={() => setShowCountryCodePicker(false)}
        onPicked={(item) => {
          setCountryCode(item.dial_code);
          setShowCountryCodePicker(false);
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Images.BackButton
            width={horizontalScale(50)}
            height={verticalScale(50)}
            style={{
              transform: [{ rotateY: I18nManager.isRTL ? "180deg" : "0deg" }],
            }}
          />
        </Pressable>
        <Text
          style={{ marginStart: 22 }}
          fontSize="xl"
          color="BLACK_COLOR"
          textAlign={"center"}
          fontFamily={Fonts.POPPINS_SEMI_BOLD}
        >
          {t("forgot_password")}
        </Text>
      </View>

      <Text
        color="GREY"
        fontSize="sm"
        letterSpacing="0.32"
        mt={verticalScale(16)}
        fontFamily={Fonts.POPPINS_MEDIUM}
      >
        {t("please_enter_email_phone")}
      </Text>

      <ValueToggle
        leftText={t("email")}
        rightText={t("phone_captialized")}
        initial={"left"}
        onToggle={(value) => {
          reset();
          setIsEmailSelected(value === "left");
        }}
        isDisabled={isLoading}
      />

      <FormControl mt={verticalScale(20)}>
        {isEmailSelected ? (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
                  readOnly={isLoading}
                  placeholder={t("enter_email_id")}
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
          </>
        ) : (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
                  readOnly={isLoading}
                  placeholder={t("phone_number")}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  keyboardType={"number-pad"}
                  maxLength={10}
                  InputLeftElement={
                    <Pressable
                      isDisabled={isLoading}
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
                        style={{
                          borderWidth: 0.5,
                          borderColor: "BORDER_COLOR",
                          borderRadius: 5,
                          height: 5,
                          marginLeft: 5,
                        }}
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
              <Text style={globalStyles.errorText}>{errors.phone.message}</Text>
            )}
          </>
        )}
      </FormControl>
      <PrimaryButton
        text={t("send_otp")}
        onClick={handleSubmit(checkIfUserExists)}
        isDisabled={!isValid}
        isLoading={isLoading}
        props={{
          mt: verticalScale(20),
        }}
      />
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
  Togglecontainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: verticalScale(15),
  },
  selectedText: {
    backgroundColor: "#02A7FD",
    color: "#fff",
  },
  unSelectedText: {
    backgroundColor: "#F6F6F6",
    color: "#5A5A5C",
  },
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default ForgotPasswordScreen;
