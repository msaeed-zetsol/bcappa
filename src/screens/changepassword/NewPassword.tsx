import { StyleSheet, I18nManager, Modal, Keyboard } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Text, FormControl, Button, Pressable, Input, Icon } from "native-base";
import { newColorTheme } from "../../constants/Colors";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Fonts, Colors, Images } from "../../constants";
import { StackActions } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { apimiddleWare } from "../../utilities/helper-functions";
import { useTranslation } from "react-i18next";
import { View } from "react-native-animatable";
import Message from "../../components/AlertMessage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigators/stackNavigator/AuthStack";
import { useAppDispatch } from "../../hooks/hooks";
import useAxios from "../../hooks/useAxios";
import PrimaryButton from "../../components/PrimaryButton";
import globalStyles from "../../styles/global";

type NewPasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  "NewPassword"
>;

const NewPassword = ({ route, navigation }: NewPasswordProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showChangedSuccessModal, setShowChangedSuccessModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { emailOrPhone } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
  } = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    reValidateMode: "onChange",
    mode: "all",
    criteriaMode: "firstError",
  });

  const [data, start] = useAxios("/auth/forget-password", "put");
  const abortControllerRef = useRef<AbortController | null>(null);

  const changePassword = (formValues: NewPasswordFormValues) => {
    Keyboard.dismiss();
    setLoading(true);
    abortControllerRef.current = start({
      data: {
        emailOrPhone: emailOrPhone,
        newPassword: formValues.password,
      },
    });
  };

  useEffect(() => {
    if (data === null) {
      setLoading(false);
    }

    if (data) {
      setShowChangedSuccessModal(true);
    }
  }, [data]);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  return (
    <View style={styles.container}>
      <Modal
        style={{
          flex: 1,
        }}
        visible={showChangedSuccessModal}
        onRequestClose={() => setShowChangedSuccessModal(false)}
        transparent
      >
        <View style={styles.centeredView}>
          <View
            animation={"bounceIn"}
            style={[
              styles.modalView,
              {
                paddingHorizontal: horizontalScale(22),
                paddingVertical: verticalScale(20),
              },
            ]}
          >
            <Images.Verified
              height={verticalScale(140)}
              width={verticalScale(120)}
            />
            <Text style={styles.message}>
              {t("your_password_has_been_updated_please_login_to_continue")}
            </Text>

            <Button
              colorScheme={"info"}
              style={styles.loginButton}
              onPress={() => navigation.pop(2)}
            >
              <Text style={styles.loginButtonLabel}>{t("login")}</Text>
            </Button>
          </View>
        </View>
      </Modal>

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
          fontSize="xl"
          color="BLACK_COLOR"
          ml={"6"}
          textAlign={"center"}
          fontFamily={Fonts.POPPINS_SEMI_BOLD}
        >
          {t("set_new_password")}
        </Text>
      </View>
      <Text
        color="GREY"
        fontSize="sm"
        letterSpacing="0.32"
        mt={verticalScale(10)}
        ml="2"
        fontFamily={Fonts.POPPINS_MEDIUM}
      >
        {t("set_strong_password_for_your_account")}
      </Text>
      <FormControl w="100%">
        <Controller
          control={control}
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
            validate: (_, formValues) => {
              if (formValues.password === formValues.confirmPassword) {
                clearErrors("confirmPassword");
                return undefined;
              } else {
                return t("both_password_must_same");
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              readOnly={isLoading}
              placeholder={t("new_password")}
              w="100%"
              size="lg"
              borderRadius={16}
              p="3"
              pl="6"
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
                    mr="6"
                    color="muted.400"
                  />
                </Pressable>
              }
            />
          )}
        />
        {errors.password && (
          <Text style={globalStyles.errorText}>{errors.password.message}</Text>
        )}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: t("confirm_password_is_required"),
            minLength: {
              value: 8,
              message: t("password_length_must_be_greater_than_8"),
            },
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: t("password_alpha_numeric_only"),
            },
            validate: (_, formValues) => {
              if (formValues.password === formValues.confirmPassword) {
                clearErrors("password");
                return undefined;
              } else {
                return t("both_password_must_same");
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              readOnly={isLoading}
              placeholder={t("confirm_password")}
              w="100%"
              size="lg"
              borderRadius={16}
              p="3"
              pl="6"
              mt={verticalScale(25)}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              type={showConfirmPassword ? "text" : "password"}
              borderColor="BORDER_COLOR"
              placeholderTextColor={"GREY"}
              color={"BLACK_COLOR"}
              fontSize={"sm"}
              fontFamily={Fonts.POPPINS_REGULAR}
              InputRightElement={
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    as={
                      <MaterialIcons
                        name={
                          showConfirmPassword ? "visibility" : "visibility-off"
                        }
                      />
                    }
                    size={5}
                    mr="6"
                    color="muted.400"
                  />
                </Pressable>
              }
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={globalStyles.errorText}>
            {errors.confirmPassword.message}
          </Text>
        )}
      </FormControl>
      <PrimaryButton
        text={t("save")}
        isDisabled={!isValid}
        isLoading={isLoading}
        onClick={handleSubmit(changePassword)}
        props={{
          mt: verticalScale(20),
        }}
      />
    </View>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: newColorTheme.WHITE_COLOR,
    paddingHorizontal: horizontalScale(28),
    paddingVertical: verticalScale(30),
  },
  loginButton: {
    height: 66,
    width: "100%",
    borderRadius: 16,
    backgroundColor: Colors.PRIMARY_COLOR,
  },
  loginButtonLabel: {
    color: "white",
    fontFamily: Fonts.POPPINS_BOLD,
    fontSize: verticalScale(18),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.63)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    width: "90%",
  },
  message: {
    paddingVertical: 24,
    fontSize: verticalScale(18),
    color: Colors.BLACK_COLOR,
    lineHeight: verticalScale(25),
    textAlign: "center",
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
  },
});
