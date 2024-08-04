import { Modal } from "react-native";
import React, { useState } from "react";
import {
  Button,
  FormControl,
  Icon,
  Input,
  Pressable,
  Text,
  View,
} from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Fonts, Images } from "../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { CountryPicker } from "react-native-country-codes-picker";
import { useTranslation } from "react-i18next";
import AppBar from "../../components/AppBar";

const VerifiedAccountDetails = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");
  const { t } = useTranslation();

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} px={horizontalScale(20)}>
      <Modal visible={showDropdown} transparent={true} animationType="slide">
        <CountryPicker
          lang={"en"}
          show={showDropdown}
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setShowDropdown(false);
          }}
          style={{
            modal: {
              height: verticalScale(500),
            },
          }}
          onBackdropPress={() => setShowDropdown(false)}
        />
      </Modal>
      <AppBar name={t("verify_account")} onPress={navigation.goBack} />
      <View mt={7} alignItems="center">
        <Images.Congratulations />
        <Text
          fontFamily={Fonts.POPPINS_SEMI_BOLD}
          fontSize={verticalScale(25)}
          mt={6}
        >
          {t("account_verified")}
        </Text>
      </View>
      <FormControl mt={verticalScale(25)}>
        <Input
          placeholder={t("phone_number")}
          w="100%"
          size="lg"
          borderRadius={16}
          p="3"
          autoCapitalize="none"
          keyboardType="number-pad"
          autoCorrect={false}
          borderColor="BORDER_COLOR"
          placeholderTextColor={"GREY"}
          color={"BLACK_COLOR"}
          fontSize={"sm"}
          fontFamily={Fonts.POPPINS_REGULAR}
          InputLeftElement={
            <Pressable
              onPress={() => setShowDropdown(true)}
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
        backgroundColor={"RED_COLOR"}
        size={"lg"}
        mt={verticalScale(50)}
        p={"4"}
        borderRadius={16}
        isPressed={isLoading}
        onPress={() => {
          setIsLoading(true);

          console.log("hello");
        }}
      >
        {t("remove_account")}
      </Button>
    </View>
  );
};

export default VerifiedAccountDetails;
