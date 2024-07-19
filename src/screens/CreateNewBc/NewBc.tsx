import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, memo, useMemo } from "react";
import {
  Text,
  View,
  FormControl,
  Input,
  Box,
  Pressable,
  Icon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import Colors, { newColorTheme } from "../../constants/Colors";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Fonts, Images } from "../../constants";
import ToggleSwitch from "toggle-switch-react-native";
import Heading from "../../components/Heading";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import { BcSelectionType, BcType } from "../../lookups/Enums";
import TextFieldComponent from "../../components/TextFieldComponent";
import DateTimePicker from "@react-native-community/datetimepicker";
import { setMembers } from "../../redux/members/membersSlice";
import { errors } from "../../redux/user/userSlice";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import globalStyles from "../../styles/global";
import Message from "../../components/AlertMessage";

const NewBc = () => {
  const numberformatter = useMemo(() => new Intl.NumberFormat(), []);
  const [disabled, setIsDisabled] = useState(false);
  const [balloting, setBalloting] = useState(false);
  const [maxUsers, setMaxUsers] = useState("");
  const [amountPerMonth, setAmountPerMonth] = useState("");
  const [bcTotal, setBcTotal] = useState("0");
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const members = useAppSelector((state) => state.members);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    calculateTotal();
  }, [maxUsers, amountPerMonth]);

  const calculateTotal = () => {
    setBcTotal(numberformatter.format(+maxUsers * +amountPerMonth));
  };

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      title: "",
      totalUsers: "",
      amountPerMonth: "",
    },
  });

  const createBc = async (details: any) => {
    if (showDate) {
      setIsDisabled(true);
      if (members.length >= 1) {
        console.log(
          " ---------------- members before delete ---------------- "
        );
        console.log(members);

        if (balloting) {
          members.map((item: any, index: any) => {
            delete item.openingPrecedence;
          });
        }

        console.log(" ---------------- members after delete ---------------- ");
        console.log(members);

        if (members.length <= +details.totalUsers) {
          const data = {
            title: details.title,
            type: BcType.Private,
            selectionType: balloting
              ? BcSelectionType.Auto
              : BcSelectionType.Manual,
            maxMembers: +details.totalUsers,
            amount: +details.amountPerMonth,
            bcMembers: members,
            commenceDate: date,
          };

          console.log({ sayen: data.bcMembers });
          const response = await apimiddleWare({
            url: "/bcs",
            method: "post",
            data: data,
            reduxDispatch: dispatch,
            navigation,
          });
          if (response) {
            console.log({ response });
            setIsDisabled(false);

            dispatch(setMembers([]));
            navigation.goBack();
          }
          setIsDisabled(false);
        } else {
          Alert.alert("Members can not be more than max members");
          setIsDisabled(false);
        }
      } else {
        setModalVisible(true);
        setIsDisabled(false);
      }
    } else {
      dispatch(errors({ message: "Starting date is required", value: true }));
    }
  };

  const handleDialPress = () => {
    const phoneNumberURL = `tel:03163110456`;
    Linking.openURL(phoneNumberURL).catch((error) => {
      console.error(`Failed to open the phone dialer: ${error}`);
    });
  };



  return (

    <View flex={1} bg={"BACKGROUND_COLOR"} px={horizontalScale(20)}>
      <StatusBar backgroundColor={newColorTheme.BACKGROUND_COLOR} />
      <Heading
        name={t("create_new_bc")}
        onPress={() => {
          dispatch(setMembers([]));
          navigation.goBack();
        }}
      />
      <Box mt={verticalScale(40)}></Box>
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        {modalVisible && (
          <Message
          Photo={() => <Images.AccountNotVerified />}
          message={t("Please Add Members")}
          buttonText={t("ok")}
          callback={() => setModalVisible(false)}
          secondButtonText={t("Cancel")}
          secondCallback={() => setModalVisible(false)}
          show={modalVisible}
        />
        )}
        <FormControl w="100%">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Input
                  placeholder={t("title")}
                  w="100%"
                  size="lg"
                  borderRadius={16}
                  p="3"
                  pl="6"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  borderColor="BORDER_COLOR"
                  placeholderTextColor={"GREY"}
                  color={"BLACK_COLOR"}
                  fontFamily={Fonts.POPPINS_REGULAR}
                  fontSize={"sm"}
                  inputMode="text"
                />
              </View>
            )}
            name="title"
            rules={{
              required: t("title_is_required"),
            }}
            defaultValue=""
          />
          {formErrors.title && (
            <Text style={globalStyles.errorText}>{t("title_is_required")}</Text>
          )}
          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder={t("max_users")}
                    w="100%"
                    size="lg"
                    borderRadius={16}
                    p="3"
                    pl="6"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      setMaxUsers(text);
                      onChange(text);
                    }}
                    value={value}
                    borderColor="BORDER_COLOR"
                    placeholderTextColor={"GREY"}
                    color={"BLACK_COLOR"}
                    fontFamily={Fonts.POPPINS_REGULAR}
                    fontSize={"sm"}
                  />
                </View>
              )}
              name="totalUsers"
              rules={{
                required: t("max_users_required"),
              }}
              defaultValue=""
            />
            {formErrors.totalUsers && (
              <Text style={globalStyles.errorText}>
                {t("max_users_required")}
              </Text>
            )}
          </View>
          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder={t("amount_per_month")}
                    w="100%"
                    size="lg"
                    borderRadius={16}
                    p="3"
                    pl="6"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      setAmountPerMonth(text);
                      onChange(text);
                    }}
                    value={value}
                    borderColor="BORDER_COLOR"
                    placeholderTextColor={"GREY"}
                    color={"BLACK_COLOR"}
                    fontFamily={Fonts.POPPINS_REGULAR}
                    fontSize={"sm"}
                  />
                </View>
              )}
              name="amountPerMonth"
              rules={{
                required: t("amount_per_month_required"),
              }}
              defaultValue=""
            />
            {formErrors.amountPerMonth && (
              <Text style={globalStyles.errorText}>
                {t("amount_per_month_required")}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setOpenDate(true)}
            style={{ marginTop: verticalScale(15) }}
          >
            <TextFieldComponent
              placeholder={t("starting_date")}
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
          <Text
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            mt={verticalScale(10)}
            fontSize={"sm"}
            color={"GREY"}
          >
            {t("total_expected_amount")}{" "}
            <Text color={"PRIMARY_COLOR"} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              {bcTotal}
            </Text>
          </Text>
        </FormControl>
        <View
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={verticalScale(35)}
        >
          <Text fontFamily={Fonts.POPPINS_SEMI_BOLD} fontSize={"lg"}>
            {t("bc_balloting")}
          </Text>
          <View>
            <ToggleSwitch
              isOn={balloting}
              onColor={Colors.PRIMARY_COLOR}
              offColor={Colors.GREY}
              label={balloting ? "Auto" : "Manual"}
              labelStyle={{
                color: Colors.GREY,
                fontFamily: Fonts.POPPINS_SEMI_BOLD,
              }}
              size="medium"
              onToggle={async () => {
                setBalloting(!balloting);
              }}
              thumbOffStyle={{
                backgroundColor: Colors.WHITE_COLOR,
              }}
              thumbOnStyle={{
                backgroundColor: Colors.WHITE_COLOR,
              }}
            />
          </View>
        </View>

        {openDate && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode={"date"}
            display="default"
            minimumDate={new Date()}
            onChange={(txt: any) => {
              setOpenDate(false);
              const data = new Date(txt.nativeEvent.timestamp);
              setDate(data);
              setShowDate(data.toLocaleDateString());
            }}
            style={{ flex: 1, backgroundColor: "red" }}
            positiveButton={{ label: "OK", textColor: Colors.PRIMARY_COLOR }}
            negativeButton={{
              label: "Cancel",
              textColor: Colors.PRIMARY_COLOR,
            }}
          />
        )}

        <View
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mt={verticalScale(30)}
        >
          <Text fontFamily={Fonts.POPPINS_SEMI_BOLD} fontSize={"lg"}>
            {t("members")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate("AddMembers", {
                balloting: balloting,
                members: members,
                maxUsers: maxUsers,
              })
            );
          }}
        >
          <Images.AddUser />
          <Text
            color={Colors.PRIMARY_COLOR}
            ml={horizontalScale(5)}
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
          >
            {t("view_members")} {`(${members.length})`}
          </Text>
        </TouchableOpacity>

        <View justifyContent={"flex-end"} mb={verticalScale(10)}>
          <Text
            color={Colors.BLACK_COLOR}
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            my={verticalScale(5)}
            fontSize={"md"}
          >
            {t("dont_know_how_to_add")}
          </Text>
          <TouchableOpacity
            onPress={handleDialPress}
            style={[
              styles.btnContainer,
              {
                borderColor: Colors.PRIMARY_COLOR,
                borderWidth: 2,
                backgroundColor: "white",
              },
            ]}
          >
            <Images.Call />
            <Text
              color={Colors.PRIMARY_COLOR}
              ml={horizontalScale(5)}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}
            >
              {t("call_our_helpline")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit(createBc)}
            disabled={disabled}
            style={[
              styles.btnContainer,
              {
                backgroundColor: disabled ? Colors.GREY : Colors.PRIMARY_COLOR,
                borderColor: disabled ? Colors.GREY : Colors.PRIMARY_COLOR,
                borderWidth: 2,
                marginTop: verticalScale(10),
              },
            ]}
          >
            <Text
              color={Colors.WHITE_COLOR}
              ml={horizontalScale(5)}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}
            >
              {t("create")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default NewBc;

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#F0FAFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: verticalScale(15),
    borderRadius: 15,
    marginVertical: verticalScale(10),
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },
  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: "#999999",
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: horizontalScale(10),
  },
  row: {
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: horizontalScale(2),
    flex: 1,
    marginVertical: verticalScale(10),

    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },
  text: {
    fontSize: 22,
    color: "#222222",
  },
  memberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(17),
    marginLeft: horizontalScale(5),
  },
  details: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(15),
  },
  desc: {
    color: Colors.GREY,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
});
