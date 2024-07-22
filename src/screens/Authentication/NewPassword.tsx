import { StyleSheet, I18nManager, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Text, FormControl, Button, Pressable, Input, Icon } from 'native-base';
import { newColorTheme } from '../../constants/Colors';
import { horizontalScale, verticalScale } from '../../utilities/Dimensions';
import { Fonts, Colors, Images } from '../../constants';
import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { View } from "react-native-animatable";
import Message from '../../components/AlertMessage';

const NewPassword = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState<boolean>(false);
  const [show1, setShow1] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalView, setModalView] = useState(false);
  const dispatch: any = useDispatch();
  const navigation = useNavigation();
  const route: any = useRoute();
  const { data } = route?.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const changePass = async (details: {
    password: any;
    confirmPassword: any;
  }) => {
    console.log({ details });
    if (details.password === details.confirmPassword) {
      const datas = {
        emailOrPhone: data.email ? data.email : data.phone,
        newPassword: details.password,
      };
      setIsLoading(true);
      const response = await apimiddleWare({
        url: "/auth/forget-password",
        method: "put",
        data: datas,
        reduxDispatch: dispatch,
      });
      setIsLoading(false);
      if (response) {
        console.log({ response });
        setModalVisible(true);
      }
    } else {
     setModalView(true);
    }
  };

  const handleLogin = () => {
    setModalVisible(false);
    navigation.dispatch(
      StackActions.replace("AuthStack", {
        screen: "LoginScreen",
      })
    );
  };

  return (
    <View style={styles.container}>
         {modalView && (
          <Message
          Photo={() => <Images.AccountNotVerified />}
          message={t("password_must_match_confirm_password_please_try_again")}
          buttonText={t("ok")}
          callback={() => setModalView(false)}
          secondButtonText={t("cancel")}
          secondCallback={() => setModalView(false)}
          show={modalView}
        />
        )}
      <Modal
        style={{
          flex: 1,
        }}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
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
              onPress={handleLogin}
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
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
              type={show ? "text" : "password"}
              borderColor="BORDER_COLOR"
              placeholderTextColor={"GREY"}
              color={"BLACK_COLOR"}
              fontSize={"sm"}
              fontFamily={Fonts.POPPINS_REGULAR}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? "visibility" : "visibility-off"}
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
          <Text
            style={{ marginStart: 16, fontSize: 13 }}
            color={"ERROR"}
            marginTop={verticalScale(3)}
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {errors.password.message}
          </Text>
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
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
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
              type={show1 ? "text" : "password"}
              borderColor="BORDER_COLOR"
              placeholderTextColor={"GREY"}
              color={"BLACK_COLOR"}
              fontSize={"sm"}
              fontFamily={Fonts.POPPINS_REGULAR}
              InputRightElement={
                <Pressable onPress={() => setShow1(!show1)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show1 ? "visibility" : "visibility-off"}
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
          <Text
            style={{ marginStart: 16, fontSize: 13 }}
            color={"ERROR"}
            marginTop={verticalScale(3)}
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {errors.confirmPassword.message}
          </Text>
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
        onPress={handleSubmit(changePass)}
      >
        {t("save")}
      </Button>
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
    backgroundColor: Colors.PRIMARY_COLOR
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
