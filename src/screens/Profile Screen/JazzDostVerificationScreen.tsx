import { StyleSheet, StatusBar, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { View, Text, Pressable, Icon, Button } from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import Colors, { newColorTheme } from "../../constants/Colors";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Fonts, Images } from "../../constants";
import TextFieldComponent from "../../components/TextFieldComponent";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CountryPicker } from "react-native-country-codes-picker";
import { useTranslation } from "react-i18next";
import AppBar from "../../components/AppBar";

const JazzDostVerificationScreen = () => {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState("+92");
  const [showDropdown, setShowDropdown] = useState(false);
  const [number, setNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dostLoading, setDostLoading] = useState(false);
  const { t } = useTranslation();

  return (
    <View
      flex={1}
      bg={"BACKGROUND_COLOR"}
      pt={verticalScale(15)}
      px={horizontalScale(20)}
    >
      <AppBar name={t("jazz_dost_verification")} onPress={navigation.goBack} />
      <View flexDirection={"row"} alignItems={"center"} mt={verticalScale(30)}>
        <Text
          color={Colors.GREY}
          fontFamily={Fonts.POPPINS_MEDIUM}
          mr={1}
          fontSize={verticalScale(15)}
          letterSpacing={0.5}
        >
          {t("verify_your")}
        </Text>
        <Images.JazzDostIcon width={60} />
        <Text
          color={Colors.GREY}
          fontFamily={Fonts.POPPINS_MEDIUM}
          ml={1}
          fontSize={verticalScale(15)}
          letterSpacing={0.5}
        >
          {t("account_with")}
        </Text>
        <Text
          color={Colors.PRIMARY_COLOR}
          fontFamily={Fonts.POPPINS_SEMI_BOLD}
          ml={1}
          fontSize={verticalScale(16)}
          letterSpacing={0.5}
        >
          {t("bc_appa")}
        </Text>
      </View>
      <View mt={verticalScale(20)} />
      <TextFieldComponent
        placeholder={t("phone_number")}
        value={number}
        maxLength={10}
        onChange={(num) => {
          setNumber(num);
        }}
        keyboardType={"number-pad"}
        InputLeftElement={
          <Pressable
            onPress={() => setShowDropdown(true)}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            ml="3"
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
        InputRightElement={
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text mr="3" color={Colors.PRIMARY_COLOR}>
              {t("change_number")}
            </Text>
            <Text
              borderBottomColor={Colors.PRIMARY_COLOR}
              borderBottomWidth={1}
              position={"absolute"}
              left={0}
              right={0}
              bottom={0}
              mr="3"
            />
          </TouchableOpacity>
        }
      />
      <View
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        mt={verticalScale(8)}
      >
        <Images.ErrorIcon />
        <Text color={Colors.ERROR} ml={2} fontFamily={Fonts.POPPINS_MEDIUM}>
          {t("didnt_find_jazzdost_account")}
        </Text>
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
        mt={verticalScale(40)}
        p={"4"}
        borderRadius={16}
        isPressed={isLoading}
        onPress={() => {
          setIsLoading(true);
        }}
      >
        {t("verify")}
      </Button>
      <Button
        isLoading={dostLoading}
        variant="solid"
        _text={{
          color: "BLACK_COLOR",
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
        spinnerPlacement="end"
        backgroundColor={"WHITE_COLOR"}
        borderColor={"BLACK_COLOR"}
        borderWidth={1}
        size={"lg"}
        mt={verticalScale(20)}
        p={"4"}
        borderRadius={16}
        isPressed={isLoading}
        onPress={() => {
          setDostLoading(true);
          navigation.dispatch(CommonActions.navigate("JazzDostSignup"));
          setDostLoading(false);
        }}
      >
        <View
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text
            color={"BLACK_COLOR"}
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            mr={1}
          >
            {t("sign_up_on")}
          </Text>
          <Images.JazzDostIcon width={50} height={20} />
        </View>
      </Button>

      <Modal visible={showDropdown} transparent={true} animationType="slide">
        <CountryPicker
          lang={"en"}
          show={showDropdown}
          // when picker button press you will get the country object with dial code
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setShowDropdown(false);
          }}
          style={{
            // Styles for whole modal [View]
            modal: {
              height: verticalScale(500),
            },
          }}
          onBackdropPress={() => {
            setShowDropdown(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default JazzDostVerificationScreen;

const styles = StyleSheet.create({});
