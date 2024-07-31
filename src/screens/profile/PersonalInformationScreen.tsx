import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  View,
  Text,
  Box,
  FormControl,
  Pressable,
  Icon,
  Button,
  Select,
} from "native-base";
import React, { useState, useEffect } from "react";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import Colors, { newColorTheme } from "../../constants/Colors";
import { Fonts } from "../../constants";
import { CommonActions, useNavigation } from "@react-navigation/native";
import TextFieldComponent from "../../components/TextFieldComponent";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  apimiddleWare,
  removeEmptyProperties,
} from "../../utilities/helper-functions";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import parsePhoneNumber, { PhoneNumber } from "libphonenumber-js";
import { useTranslation } from "react-i18next";
import CountryCodePicker from "../../components/CountryCodePicker";
import { apply } from "../../utilities/scope-functions";
import AppBar from "../../components/AppBar";

const initialDate = new Date();
initialDate.setDate(initialDate.getDate() - 1); // Set initial date to one day before today

const PersonalInformationScreen = () => {
  const dispatch: any = useDispatch();
  const navigation = useNavigation();
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");
  const [date, setDate] = useState(initialDate);
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [personalData, setPersonalData] = useState<any>({
    fullName: "",
    email: "",
    phone: "",
    cnic: "",
    dob: "",
    role: "",
    gender: "",
    bcAmount: 0,
  });
  const { t } = useTranslation();

  const getPersonalData = async () => {
    try {
      const response = await apimiddleWare({
        url: "/user/profile",
        method: "get",
        reduxDispatch: dispatch,
        navigation: navigation,
      });

      if (response) {
        console.log({ response: response?.dob });

        if (response?.dob) {
          const d = response?.dob?.split("T")[0];
          setShowDate(d);
        }

        let phoneNumber: PhoneNumber | undefined;

        if (response?.phone) {
          phoneNumber = parsePhoneNumber(response?.phone);
          setCountryCode("+" + phoneNumber?.countryCallingCode);
        }

        setPersonalData({
          fullName: response?.fullName || "",
          email: response?.email || "",
          phone: phoneNumber?.nationalNumber?.toString() || "",
          cnic: response?.cnic || "",
          dob: response?.dob || "",
          gender: response?.gender || "",
          bcAmount: response?.monthlyAmount || 0, // Assuming it's a number, replace with appropriate default value if needed
        });
      }
    } catch (error) {
      console.error("Error fetching personal data:", error);
    }
  };

  const getMaximumDate = (): Date => {
    return apply(new Date(), (date) => {
      date.setFullYear(date.getFullYear() - 18);
    });
  };

  const saveDetailsHandler = async () => {
    setIsLoading(true);
    const data = {
      fullName: personalData.fullName || "",
      phone:
        countryCode && personalData.phone
          ? countryCode + personalData.phone
          : "",
      monthlyAmount: +personalData.bcAmount || 0,
      cnic: personalData.cnic || "",
      dob: date ? date : "",
      gender: personalData?.gender || "",
    };

    removeEmptyProperties(data);
    try {
      const response = await apimiddleWare({
        url: "/user/profile",
        method: "put",
        data: data,
        reduxDispatch: dispatch,
        navigation: navigation,
      });
      console.log({ response });
      const stringifyUserData: any = await JSON.stringify(response);
      await AsyncStorage.setItem("loginUserData", stringifyUserData);
      navigation.goBack();
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPersonalData();
  }, []);

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} px={horizontalScale(20)}>
      <ScrollView>
        <AppBar
          name={t("personal_information")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("ProfileScreen"))
          }
        />

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
            onChange={(event, selectedDate?: Date) => {
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
            positiveButton={{ label: t("ok"), textColor: Colors.PRIMARY_COLOR }}
            negativeButton={{
              label: t("cancel"),
              textColor: Colors.PRIMARY_COLOR,
            }}
          />
        )}
        <Box mt={verticalScale(50)}>
          {/* email */}
          <FormControl mt={verticalScale(15)}>
            <TextFieldComponent
              placeholder={t("full_name")}
              value={personalData.fullName}
              onChange={(txt) => {
                setPersonalData({
                  ...personalData,
                  fullName: txt,
                });
              }}
            />

            <View mt={verticalScale(15)}>
              <TextFieldComponent
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.20)",
                }}
                placeholder={t("email")}
                value={personalData.email}
                onChange={(txt) => {
                  // setPersonalData({
                  //   ...personalData,
                  //   email: txt,
                  // });
                }}
                editable={false}
                readOnly={true}
                keyboardType={"email-address"}
              />
            </View>

            <View mt={verticalScale(15)}>
              <TextFieldComponent
                placeholder={t("phone_number")}
                value={personalData?.phone}
                onChange={(txt) => {
                  setPersonalData({
                    ...personalData,
                    phone: txt,
                  });
                }}
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
                      borderWidth={0.5}
                      borderColor={"BORDER_COLOR"}
                      height={5}
                      ml={2}
                    />
                  </Pressable>
                }
              />
            </View>

            {/*  nic*/}
            <View mt={verticalScale(15)}>
              <TextFieldComponent
                placeholder={t("cnic_no")}
                value={personalData.cnic}
                onChange={(txt) => {
                  setPersonalData({
                    ...personalData,
                    cnic: txt,
                  });
                }}
                keyboardType={"number-pad"}
              />
            </View>
            {/* <View mt={verticalScale(15)}>
              <TextFieldComponent
                placeholder={'Date of Birth'}
                value={personalData.dob.split('T')[0]}
                editable={false}
                onChange={() => {
                  // setPersonalData({
                  //   ...personalData,
                  //   dob: date,
                  // });
                }}
                // InputRightElement={
                //   <Pressable onPress={() => setOpenDate(true)}>
                //     <Icon
                //       as={<Ionicons name={'calendar'} />}
                //       size={5}
                //       mr="5"
                //       color="muted.400"
                //     />
                //   </Pressable>
                // }
              />
            </View> */}
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
              <FormControl borderRadius={16} isReadOnly>
                <Select
                  padding={3}
                  selectedValue={personalData?.gender}
                  borderRadius={16}
                  placeholderTextColor={"GREY"}
                  color={"BLACK_COLOR"}
                  fontSize={"sm"}
                  fontFamily={Fonts.POPPINS_REGULAR}
                  accessibilityLabel="Select Gender"
                  dropdownIcon={
                    <Icon
                      as={<Ionicons name={"caret-down"} />}
                      size={5}
                      mr={5}
                      color="BLACK_COLOR"
                    />
                  }
                  placeholder={t("select_gender")}
                  onValueChange={(itemValue) =>
                    setPersonalData((prev: any) => ({
                      ...prev,
                      gender: itemValue,
                    }))
                  }
                >
                  <Select.Item label={t("male")} value="male" />
                  <Select.Item label={t("female")} value="female" />
                  <Select.Item label={t("other")} value="other" />
                </Select>
              </FormControl>
            </View>

            <View mt={verticalScale(15)}>
              <TextFieldComponent
                placeholder={t("bc_amount")}
                value={
                  personalData?.bcAmount === null
                    ? 0
                    : personalData?.bcAmount?.toString()
                }
                onChange={(txt) => {
                  setPersonalData({
                    ...personalData,
                    bcAmount: txt,
                  });
                }}
                keyboardType={"number-pad"}
              />
              <Text
                style={{ fontFamily: Fonts.POPPINS_SEMI_BOLD, marginTop: 3 }}
              >
                {t("amount_used_match_bcs")}
              </Text>
            </View>
          </FormControl>
        </Box>
        {/*  */}
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
          onPress={saveDetailsHandler}
        >
          {t("save")}
        </Button>
      </ScrollView>
    </View>
  );
};

export default PersonalInformationScreen;

const styles = StyleSheet.create({});
