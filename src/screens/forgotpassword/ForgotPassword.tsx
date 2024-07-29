import { StyleSheet, View, TouchableOpacity, I18nManager } from "react-native";
import { Text, FormControl, Button, Icon } from "native-base";
import React, { useState } from "react";
import { newColorTheme } from "../../constants/Colors";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Fonts, Images } from "../../constants";
import { useForm, Controller } from "react-hook-form";
import TextFieldComponent from "../../components/TextFieldComponent";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import CountryCodePicker from "../../components/CountryCodePicker";
import { useAppDispatch } from "../../hooks/hooks";
import { apimiddleWare } from "../../utilities/helper-functions";

type EmailVerification = {
  email: string;
};

type PhoneVerification = {
  phone: string;
};

type UserVerification = EmailVerification | PhoneVerification;

type ForgotPasswordForm = {
  email: string;
  phoneNumber: string;
};

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigation: any = useNavigation();
  const [isEmailSelected, setIsEmailSelected] = useState(true);
  const dispatch = useAppDispatch();
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
  });

  const handleSendOTP = async (details: ForgotPasswordForm) => {
    setIsLoading(true);
    const data = isEmailSelected
      ? { email: details.email }
      : { phone: countryCode + details.phoneNumber };
    const exists = await doesUserExists(data);
    if (exists) {
      forgotHandler(details);
    } else {
      setIsLoading(false);
    }
  };

  const doesUserExists = async (data: UserVerification): Promise<boolean> => {
    const response = await apimiddleWare({
      url: "/auth/check-user",
      method: "post",
      data: data,
      reduxDispatch: dispatch,
      navigation,
    });

    if (response && response.message === "Success") {
      return true;
    } else {
      return false;
    }
  };

  const forgotHandler = async (details: ForgotPasswordForm) => {
    const data = isEmailSelected
      ? { email: details.email }
      : { phone: countryCode + details.phoneNumber };

    const response = await apimiddleWare({
      url: "/otp",
      method: "post",
      data,
      reduxDispatch: dispatch,
      navigation,
    });

    console.log(`Account Verification: ${JSON.stringify(response)}`);

    if (response) {
      navigation.navigate("AccountVerificationScreen", {
        data: data,
        show: true,
        from: "forgot",
        hide: true,
        verificationType: "phone",
      });
    }
    setIsLoading(false);
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

      <View style={styles.Togglecontainer}>
        <TouchableOpacity
          onPress={() => {
            reset({
              phoneNumber: "",
              email: "",
            });
            setIsEmailSelected(true);
          }}
        >
          <Text
            style={[
              styles.text,
              isEmailSelected ? styles.selectedText : styles.unSelectedText,
              {
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              },
            ]}
          >
            {t("email")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            reset({
              phoneNumber: "",
              email: "",
            });
            setIsEmailSelected(false);
          }}
        >
          <Text
            style={[
              styles.text,
              !isEmailSelected ? styles.selectedText : styles.unSelectedText,
              {
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              },
            ]}
          >
            {t("phone_captialized")}
          </Text>
        </TouchableOpacity>
      </View>

      <FormControl mt={verticalScale(20)}>
        {isEmailSelected ? (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
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
              <Text
                color={"ERROR"}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}
              >
                {errors.email.message}
              </Text>
            )}
          </>
        ) : (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextFieldComponent
                  placeholder={t("phone_number")}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  keyboardType={"number-pad"}
                  InputLeftElement={
                    <Pressable
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
              name="phoneNumber"
              rules={{
                required: t("phone_is_required"),
                maxLength: {
                  value: 10,
                  message: t("phone_is_invalid"),
                },
              }}
              defaultValue=""
            />
            {errors.phoneNumber && (
              <Text
                color={"ERROR"}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}
              >
                {errors.phoneNumber.message}
              </Text>
            )}
          </>
        )}
      </FormControl>
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
        mt={verticalScale(20)}
        p={"4"}
        borderRadius={16}
        isPressed={isLoading}
        onPress={handleSubmit(handleSendOTP)}
      >
        {t("send_otp")}
      </Button>
    </View>
  );
};

export default ForgotPassword;

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
