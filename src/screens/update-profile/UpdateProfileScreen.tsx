import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import parsePhoneNumber, { PhoneNumber } from "libphonenumber-js";
import { View, Text, Box, Pressable, Icon, Select } from "native-base";
import React, { useState, useEffect, useRef } from "react";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import Colors, { deepSkyBlue, newColorTheme } from "../../constants/Colors";
import { Fonts } from "../../constants";
import TextFieldComponent from "../../components/TextFieldComponent";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import CountryCodePicker from "../../components/CountryCodePicker";
import { apply } from "../../utilities/scope-functions";
import AppBar from "../../components/AppBar";
import useAxios from "../../hooks/useAxios";
import { Controller, useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators/stack-navigator/StackNavigator";
import globalStyles from "../../styles/global";
import PrimaryButton from "../../components/PrimaryButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UpdatePersonalInformationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "UpdateProfileScreen"
>;

const UpdateProfileScreen = ({
  route,
  navigation,
}: UpdatePersonalInformationScreenProps) => {
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");
  const { t } = useTranslation();

  const getMaximumDate = (): Date => {
    return apply(new Date(), (date) => {
      date.setFullYear(date.getFullYear() - 18);
    });
  };
  const [selectedDate, setSelectedDate] = useState(getMaximumDate());
  const profile = route.params.profile;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      phone: "",
      cnic: profile.cnic,
      gender: profile.gender,
      dob: new Date(profile.dob).toLocaleDateString(),
    },
    reValidateMode: "onChange",
    mode: "onChange",
    criteriaMode: "firstError",
  });

  const [response, start] = useAxios<User>("/user/profile", "put");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSave = async (formValues: ProfileFormValues) => {
    const values = {
      ...formValues,
      phone: countryCode + formValues.phone,
      dob: selectedDate,
    };
    delete values.email;
    abortControllerRef.current = start({ data: values });
  };

  useEffect(() => {
    if (response === null) {
      setLoading(false);
    }

    if (response) {
      AsyncStorage.setItem("loginUserData", JSON.stringify(response), () => {
        navigation.goBack();
      });
    }
  }, [response]);

  useEffect(() => {
    const phone = parsePhoneNumber(profile.phone);
    if (phone) {
      setCountryCode(`+${phone.countryCallingCode}`);
      setValue("phone", phone.nationalNumber.toString(), {
        shouldValidate: true,
      });
    }
    return () => {
      reset();
      abortControllerRef.current?.abort();
    };
  }, []);

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
                setValue("dob", date.toLocaleDateString(), {
                  shouldValidate: true,
                });
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
        name={t("personal_information")}
        onPress={navigation.goBack}
        style={{ marginHorizontal: horizontalScale(28) }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: horizontalScale(28),
        }}
        contentContainerStyle={{
          paddingTop: verticalScale(36),
          paddingBottom: verticalScale(16),
          flex: 1,
          justifyContent: "space-between",
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
                  isDisabled={true}
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
        </Box>

        <PrimaryButton
          isLoading={loading}
          isDisabled={!isValid}
          text={t("save")}
          props={{ mt: verticalScale(50) }}
          onClick={() => {
            setLoading(true);
            handleSubmit(handleSave)();
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: newColorTheme.WHITE_COLOR,
    paddingVertical: verticalScale(8),
  },
});

export default UpdateProfileScreen;
