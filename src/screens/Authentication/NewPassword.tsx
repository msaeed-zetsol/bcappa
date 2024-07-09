import {StyleSheet, View, Alert, I18nManager} from 'react-native';
import React, {useState} from 'react';
import {Text, FormControl, Button, Pressable, Input, Icon} from 'native-base';
import {newColorTheme} from '../../constants/Colors';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import {Fonts, Images} from '../../constants';
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

const NewPassword = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState<boolean>(false);
  const [show1, setShow1] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch: any = useDispatch();
  const navigation = useNavigation();
  const route: any = useRoute();
  const { data } = route?.params;
  console.log({ data });
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
  const changePass = async (details: any) => {
    console.log({ details });
    if (details.password === details.confirmPassword) {
      const datas = {
        emailOrPhone: data.email ? data.email : data.phone,
        newPassword: details.password,
      };
      const response = await apimiddleWare({
        url: "/auth/forget-password",
        method: "put",
        data: datas,
        reduxDispatch: dispatch,
      });
      if (response) {
        console.log({ response });
        navigation.dispatch(
          StackActions.replace("AuthStack", {
            screen: "LoginScreen",
          })
        );
      }
    } else {
      Alert.alert("Password must match confirm Password");
    }
  };
  return (
    <View style={styles.container}>
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
          ml={"2"}
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
        fontFamily={Fonts.POPPINS_MEDIUM}
      >
        {t("set_strong_password_for_your_account")}
      </Text>
      <FormControl w="100%">
        <Controller
          control={control}
          rules={{
            required: t("password_is_required"),
            minLength: 8,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t("password")}
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
                    mr="2"
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
            color={"ERROR"}
            marginTop={verticalScale(5)}
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {t("password_length_must_be_greater_than_8")}
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: t("password_is_required"),
            minLength: 8,
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
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <Text
            color={"ERROR"}
            marginTop={verticalScale(5)}
            fontFamily={Fonts.POPPINS_MEDIUM}
          >
            {t("password_length_must_be_greater_than_8")}
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
        Save
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
});
