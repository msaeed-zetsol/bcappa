import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  FormControl,
  Input,
  Box,
  Pressable,
  Icon,
  Toast,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import Colors, { newColorTheme } from "../../constants/Colors";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Fonts, Images } from "../../constants";
import ToggleSwitch from "toggle-switch-react-native";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import { BcSelectionType, BcStatus, BcType } from "../../lookups/Enums";
import { useDispatch, useSelector } from "react-redux";
import TextFieldComponent from "../../components/TextFieldComponent";
import { setMembers } from "../../redux/members/membersSlice";
import { RootState } from "../../redux/store";
import { removeMembers } from "../../redux/user/userSlice";
import { useTranslation } from "react-i18next";
import AppBar from "../../components/AppBar";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { apply } from "../../scope-functions";

const UpdateBc = () => {
  const numberformatter = useMemo(() => new Intl.NumberFormat(), []);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route: any = useRoute();
  const { item } = route.params;
  const [bcTotal, setBcTotal] = useState("0");
  const [bcData, setBcData] = useState<any>();
  const [disabled, setIsDisabled] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [date, setDate] = useState<any>(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState("");
  const [load, setLoad] = useState(true);
  const [bcId, setBcId] = useState(0);
  const members = useAppSelector((state) => state.members);
  const [totalExpected, setTotalExpected] = useState(0);
  const [maxUsers, setMaxUsers] = useState(item.maxMembers);
  const [balloting, setBalloting] = useState(
    item.selectionType === BcSelectionType.Auto
  );
  const [amountPerMonth, setAmountPerMonth] = useState(item.amount);
  const { t } = useTranslation();
  useEffect(() => {
    calculateTotal();
  }, [maxUsers, amountPerMonth]);
  const calculateTotal = () => {
    if (amountPerMonth && typeof amountPerMonth === 'string') {
      const formattedAmount = amountPerMonth.split(",").join("");
      setBcTotal(numberformatter.format(+maxUsers * +formattedAmount));
    } else {
      setBcTotal(numberformatter.format(0));
    }
  };
  
  const formatAmountPerMonth = (amount: string) => {
    if (amount && typeof amount === 'string' && amount !== "") {
      return numberformatter.format(+amount.split(",").join(""));
    } else {
      return "";
    }
  };
  

  const getNextDay = () => {
    return apply(new Date(), (date) => {
      return date.setDate(date.getDate() + 1);
    });
  };

  const getData = async () => {
    setLoad(true);
    const response = await apimiddleWare({
      url: `/bcs/details/${item.id}`,
      method: "get",
    });
    if (response) {
      setBcId(response[0].id);
      console.log({ sayen: response[0].bcMembers });
      setBcData(response[0]);
      response[0].bcMembers.sort(
        (a: any, b: any) => a.openingPrecedence - b.openingPrecedence
      );

      const mem = response[0].bcMembers.map((item: any) => {
        return {
          id: item?.id,
          fullName: item?.user?.fullName,
          email: item?.user?.email,
          phone: item?.user?.phone,
          openingPrecedence: item?.openingPrecedence,
        };
      });

      dispatch(setMembers(mem));
      setLoad(false);
      const d = response[0].commenceDate.split("T")[0];
      setShowDate(d);
      setBalloting(bcData.selectionType === BcSelectionType.Auto);
    }
    setLoad(false);
  };

  const {
    control: newBcControl,
    handleSubmit: handleNewBcSubmit,
    formState: { errors: newBcError },
  } = useForm({
    defaultValues: {
      title: String(item.title),
      totalUsers: String(item.maxMembers),
      amountPerMonth: String(item.amount),
    },
  });


  const handleDialPress = () => {
    const phoneNumberURL = "tel:03163110456";
    Linking.openURL(phoneNumberURL).catch((error) => {
      console.error(`Failed to open the phone dialer: ${error}`);
    });
  };

  const updateBc = async (details: any) => {
    console.log(`Max Users: ${maxUsers}`);
    console.log(`Members Length: ${members.length}`)
    const totalUsers = parseInt(maxUsers);
    const membersLength = members.length;
    if (totalUsers !== membersLength) {
      Toast.show({ title: "Please edit members before continuing." });
      return;
    }

    const finalMembers = members.map((item: any) => {
      return {
        fullName: item?.fullName,
        email: item?.email,
        phone: item?.phone,
        openingPrecedence: item?.openingPrecedence,
      };
    });

    setIsDisabled(true);

    const data = {
      title: details.title,
      status: BcStatus.Pending,
      type: BcType.Private,
      selectionType: balloting ? BcSelectionType.Auto : BcSelectionType.Manual,
      maxMembers: +details.totalUsers,
      amount: +details.amountPerMonth,
      bcMembers: finalMembers,
      commenceDate: date,
    };

    const response = await apimiddleWare({
      url: `/bcs/${item.id}`,
      method: "put",
      data: data,
      reduxDispatch: dispatch,
      navigation,
    });

    if (response) {
      console.log({ response });
      setIsDisabled(false);
      dispatch(removeMembers(null));
      navigation.goBack();
    }

    setIsDisabled(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} px={horizontalScale(20)}>
      <AppBar
        name={t("update_bc")}
        onPress={() => {
          dispatch(setMembers([]));
          navigation.goBack();
        }}
      />
      <Box mt={verticalScale(40)}></Box>
      {!load ? (
        <ScrollView scrollEnabled={scroll} showsVerticalScrollIndicator={false}>
          <FormControl w="100%">
            <Controller
              control={newBcControl}
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
            {newBcError.title && (
              <Text
                color={"ERROR"}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}
              >
                {t("title_is_required")}
              </Text>
            )}
            <View mt={verticalScale(15)}>
              <Controller
                control={newBcControl}
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
              {newBcError.totalUsers && (
                <Text
                  color={"ERROR"}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}
                >
                  {t("max_users_required")}
                </Text>
              )}
            </View>
            <View mt={verticalScale(15)}>
              <Controller
                control={newBcControl}
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
                      value={formatAmountPerMonth(value)}
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
              {newBcError.amountPerMonth && (
                <Text
                  color={"ERROR"}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}
                >
                  {t("amount_per_month_required")}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setOpenDate(true)}
              style={{ marginTop: verticalScale(15) }}
            >
              <TextFieldComponent
                placeholder={"Date of Birth"}
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
              {t("total_expected_bc_amount")}
              {": "}
              <Text
                color={"PRIMARY_COLOR"}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
              >
                Rs. {totalExpected}
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
                onToggle={async () => setBalloting(!balloting)}
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
              minimumDate={getNextDay()}
              onChange={(txt: any) => {
                console.log("bhai");
                setOpenDate(false);
                const data = new Date(txt.nativeEvent.timestamp);
                setDate(data);
                setShowDate(data.toLocaleDateString());
              }}
              style={{ flex: 1, backgroundColor: "red" }}
              positiveButton={{
                label: "OK",
                textColor: Colors.PRIMARY_COLOR,
              }}
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
                  bcId: bcId,
                  balloting: balloting,
                  members: members,
                  maxUsers: maxUsers,
                  updatingBc: true,
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
              onPress={handleNewBcSubmit(updateBc)}
              disabled={disabled}
              style={[
                styles.btnContainer,
                {
                  backgroundColor: disabled
                    ? Colors.GREY
                    : Colors.PRIMARY_COLOR,
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
                {t("update")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.PRIMARY_COLOR} />
        </View>
      )}
      {/*  */}

      {/* <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        backgroundColor={'rgba(0, 0, 0, 0.63)'}>
        <Modal.Content
          style={{
            width: '85%', // Adjust the width as needed
            borderRadius: 10, // Adjust the border radius as needed
          }}>
          <Modal.CloseButton />
          <Modal.Header>
            <Text
              alignSelf="center"
              fontFamily={Fonts.POPPINS_BOLD}
              fontSize={'lg'}>
              Add Member
            </Text>
          </Modal.Header>
          <Modal.Body
            style={{
              width: '100%',
            }}>
            <FormControl>
              <FormControl.Label>Full Name</FormControl.Label>
              <Controller
                control={addMembersControl}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    fontSize={'sm'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="fullName"
                rules={{
                  required: true,
                }}
                defaultValue=""
              />
              {addMemberError.fullName && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Full Name is required
                </Text>
              )}
            </FormControl>
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Controller
                control={addMembersControl}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    fontSize={'sm'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    onChangeText={onChange}
                  />
                )}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                defaultValue=""
              />
              {addMemberError.email && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  {addMemberError.email.message}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <FormControl.Label>Phone</FormControl.Label>
              <Controller
                control={addMembersControl}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    fontSize={'sm'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                  />
                )}
                name="phone"
                rules={{
                  required: 'Phone Number is required',
                  minLength: 6,
                }}
                defaultValue=""
              />
              {addMemberError.phone && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Phone Number is required
                </Text>
              )}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button
              isLoading={isLoading}
              isPressed={isLoading}
              _text={{
                color: 'WHITE_COLOR',
                fontFamily: Fonts.POPPINS_SEMI_BOLD,
              }}
              _loading={{
                _text: {
                  color: 'BLACK_COLOR',
                  fontFamily: Fonts.POPPINS_MEDIUM,
                },
              }}
              _spinner={{
                color: 'BLACK_COLOR',
              }}
              _pressed={{
                backgroundColor: 'DISABLED_COLOR',
              }}
              style={{
                width: '100%', // Adjust the width as needed
                borderRadius: 10, // Adjust the border radius as needed
              }}
              backgroundColor={Colors.PRIMARY_COLOR}
              onPress={handleAddMembersSubmit(addMemberHandler)}>
              Add
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal> */}
    </View>
  );
};
export default UpdateBc;

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
    // height: 100,
    flex: 1,
    marginVertical: verticalScale(10),

    borderRadius: 10,
    ...Platform.select({
      ios: {
        // width: window.width - 30 * 2,
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },
      android: {
        // width: window.width - 30 * 2,
        elevation: 12,
        // marginHorizontal: 30,
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
