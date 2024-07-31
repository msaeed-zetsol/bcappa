import {
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View, Avatar, Button } from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Images, Fonts } from "../../constants";
import {
  CommonActions,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  BcMemberStatus,
  BcMemberType,
  BcStatus,
  BcType,
} from "../../types/Enums";
import Colors, { newColorTheme } from "../../constants/Colors";
import { apimiddleWare } from "../../utilities/helper-functions";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InfoModal from "../../components/InfoModal";
import { useTranslation } from "react-i18next";
import AppBar from "../../components/AppBar";

const BcDetailsScreen = () => {
  const routes: any = useRoute();
  const [bcData, setBcData] = useState<any>([]);
  const [BcMembers, setBcMembers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>();
  const [loadScreen, setLoadScreen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bcTime, setBcTime] = useState<any>("");
  const navigation = useNavigation();
  const { t } = useTranslation();
  const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);

  const [isJazzDostVerified, setIsJazzDostVerified] = useState<boolean | null>(
    null
  );

  const [isPresent, setIsPresent] = useState<boolean>(false);
  const [isButtonPressed, setButtonPressed] = useState(false);
  const dispatch: any = useDispatch();
  const { item, deeplink } = routes.params;
  const currentDateISOString = new Date().toISOString();

  const getData = async () => {
    const getUserData: any = await AsyncStorage.getItem("loginUserData");
    const parsedUserData: any = JSON.parse(getUserData);
    setUserData(parsedUserData);
    const response = await apimiddleWare({
      url: `/bcs/details/${item}`,
      method: "get",
      navigation,
      reduxDispatch: dispatch,
    });

    console.log(`Details: ${JSON.stringify(response)}`);

    if (response) {
      const currentDate: any = new Date();
      const givenDate: any = new Date(response[0].commenceDate);
      const timeDifference = givenDate - currentDate;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (daysDifference <= 0) {
        setBcTime("Bc Started");
      } else {
        setBcTime(`BC Starts in ${Math.ceil(daysDifference)} days`);
      }

      if (
        response[0].type === "private" &&
        response[0]?.user?.id === parsedUserData.id
      ) {
        setIsAdmin(true);
      }

      setBcData(response);

      const finalMembers = response[0].bcMembers.sort((a: any, b: any) => {
        return a.openingPrecedence - b.openingPrecedence;
      });

      // Check if logged in user is admin
      const isSignedInAdminMember = finalMembers.findIndex(
        (member: any) =>
          member?.memberType === BcMemberType.Admin &&
          member?.user?.id === parsedUserData.id
      );

      // Check if logged in user is present in the bc
      const loggedInUserIndex = finalMembers.findIndex((member: any) => {
        return member?.user?.id === parsedUserData.id;
      });

      if (isSignedInAdminMember !== -1) {
        // If logged in user is an admin, move them to the top of the list
        const adminMember = finalMembers.splice(isSignedInAdminMember, 1)[0];
        finalMembers.unshift(adminMember);
      } else if (loggedInUserIndex !== -1) {
        // If logged in user is not an admin, move them to the top of the list
        const loggedInUser = finalMembers.splice(loggedInUserIndex, 1)[0];
        finalMembers.unshift(loggedInUser);

        // Check if an admin member exists and move them to the second position
        const adminMemberIndex = finalMembers.findIndex(
          (member: any) => member?.memberType === BcMemberType.Admin
        );

        if (adminMemberIndex !== -1) {
          const adminMember = finalMembers.splice(adminMemberIndex, 1)[0];
          finalMembers.splice(1, 0, adminMember);
        }
      }

      setIsPresent(loggedInUserIndex !== -1 || isSignedInAdminMember !== -1);
      setBcMembers(finalMembers);
      setIsLoading(false);
      setLoadScreen(false);
    }

    setIsLoading(false);
  };

  const Join = async () => {
    const response = await apimiddleWare({
      url: `/bcs/join/${item}`,
      method: "post",
    });
    if (response) {
      navigation.dispatch(CommonActions.navigate("MyBcsScreen"));
    }
    // if (userData?.settings?.isJazzDostVerified === false) {
    //   setIsJazzDostVerified(false);
    // } else {

    // }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    return () => {
      unsubscribe();
      setButtonPressed(false);
      setIsJazzDostVerified(null);
    };
  }, [navigation]);

  const paidOrNot = (payments: any) => {
    const date: any = new Date(currentDateISOString);
    const month: any = (date.getUTCMonth() + 1).toString();

    const matchingPayments = payments.filter((payment: any) => {
      const gotDate = new Date(payment.month).getMonth() + 1;
      return +gotDate === +month;
    });

    if (matchingPayments.length > 0) {
      return matchingPayments[0].paid;
    } else {
      // console.log('No matching payment found for the current month.');
    }
  };

  const handleCallback = (payload: any) => {
    navigation.dispatch(CommonActions.navigate("JazzDostVerification"));
    setButtonPressed(false);
    setIsJazzDostVerified(null);
  };

  useEffect(() => {
    getData();
  }, []);

  const MemoizedComponent = useMemo(() => {
    return (
      <View flex={1} bg={"BACKGROUND_COLOR"}>
        <View px={horizontalScale(20)}>
          <AppBar
            name={"BC Details"}
            onPress={() => {
              if (deeplink) {
                navigation.dispatch(
                  StackActions.replace("BottomNavigator", {
                    screen: "HomeScreen",
                    show: false,
                  })
                );
              } else {
                navigation.goBack();
              }
            }}
          />
        </View>
        {!loadScreen &&
          bcData[0].status === BcStatus.Pending &&
          bcData[0].type === BcType.Public &&
          !isPresent && (
            <Button
              style={styles.btn}
              mx={horizontalScale(20)}
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
              isDisabled={
                bcData.status === BcStatus.Pending && deeplink === false
              }
              _disabled={{
                backgroundColor: "#D3D3D3",
                _text: {
                  color: "BLACK_COLOR",
                  fontFamily: Fonts.POPPINS_SEMI_BOLD,
                },
              }}
              isPressed={isLoading}
              onPress={() => {
                Join();
              }}
            >
              {t("join_now")}
            </Button>
          )}

        {!loadScreen ? (
          <ScrollView
            contentContainerStyle={{
              maxHeight: !isAdmin && !isPresent ? "90%" : "100%",
            }}
          >
            <Text
              color={"#06202E"}
              mx={horizontalScale(20)}
              mt={verticalScale(35)}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}
              fontSize={"lg"}
            >
              {bcData[0]?.title}
            </Text>

            <View
              mx={horizontalScale(20)}
              flexDirection="row"
              justifyContent={"space-between"}
              mt={verticalScale(26)}
            >
              <View flexDirection={"row"} flex={1}>
                <Images.Calender />
                <View ml={3}>
                  <Text
                    fontSize={"sm"}
                    color="#06202E"
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                  >
                    {bcData[0].status === BcStatus.Pending &&
                      t("commence_date")}
                    {bcData[0].status === BcStatus.Active && t("due_date")}
                  </Text>
                  <Text
                    color="#5A5A5C"
                    fontFamily={Fonts.POPPINS_MEDIUM}
                    fontSize={"sm"}
                  >
                    {new Date(bcData[0].commenceDate).toLocaleDateString(
                      "en-US",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </Text>
                </View>
              </View>
              <View
                flexDirection={"row"}
                alignItems="center"
                maxWidth={150}
                width="80%"
              >
                <Images.Cash />
                <View ml={3}>
                  <Text
                    fontSize={"sm"}
                    color="#06202E"
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                  >
                    {t("monthly_amount")}
                  </Text>
                  <Text
                    color="PRIMARY_COLOR"
                    fontFamily={Fonts.POPPINS_MEDIUM}
                    fontSize={"sm"}
                  >
                    Rs. {numberFormatter.format(bcData[0]?.amount ?? 0)}
                  </Text>
                </View>
              </View>
            </View>

            {bcData[0].type === BcType.Private && (
              <View
                flexDirection={"row"}
                alignItems="flex-start"
                mt={verticalScale(36)}
                mx={horizontalScale(20)}
              >
                <Avatar
                  size={"sm"}
                  bg="cyan.500"
                  source={{
                    uri:
                      bcData[0]?.user?.profileImg ||
                      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                  }}
                >
                  TE
                </Avatar>
                <View ml={3}>
                  <Text
                    fontSize={"sm"}
                    color="#06202E"
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                  >
                    {t("created_by")}
                  </Text>
                  <Text
                    color="PRIMARY_COLOR"
                    fontFamily={Fonts.POPPINS_MEDIUM}
                    letterSpacing={1}
                    fontSize="sm"
                    isTruncated={true}
                    maxWidth={horizontalScale(250)}
                    numberOfLines={1}
                  >
                    {bcData[0]?.user?.fullName}
                  </Text>
                </View>
              </View>
            )}
            <View
              mx={horizontalScale(20)}
              justifyContent={"space-between"}
              flexDirection="row"
              mt={verticalScale(35)}
            >
              <Text
                color={"#06202E"}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={"lg"}
              >
                {t("members")}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  color="PRIMARY_COLOR"
                  fontFamily={Fonts.POPPINS_SEMI_BOLD}
                  fontSize={"lg"}
                >
                  {bcData[0].bcMembers.length}
                </Text>
                <Text
                  color="GREY"
                  fontFamily={Fonts.POPPINS_SEMI_BOLD}
                  fontSize={"lg"}
                >
                  /
                </Text>
                <Text
                  color="GREY"
                  fontFamily={Fonts.POPPINS_SEMI_BOLD}
                  fontSize={"lg"}
                >
                  {`${bcData[0].maxMembers}`}
                </Text>
              </View>
            </View>

            <FlatList
              data={BcMembers}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: verticalScale(15),
              }}
              renderItem={({ item, index }) => {
                const check = paidOrNot(item.payments) === true;
                return (
                  <TouchableOpacity activeOpacity={1}>
                    <View
                      key={index}
                      mx={horizontalScale(20)}
                      bg={"WHITE_COLOR"}
                      borderRadius={12}
                      p={3}
                      mt={6}
                      style={{
                        elevation: 5, // Elevation level (adjust as needed)
                        shadowColor: "#000", // Shadow color
                        shadowOpacity: 0.2, // Shadow opacity (adjust as needed)
                        shadowOffset: {
                          width: 10, // Horizontal offset of the shadow
                          height: 2, // Vertical offset of the shadow
                        },
                        shadowRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        flexDirection="row"
                        justifyContent={"space-between"}
                        alignItems={"flex-start"}
                        mb={
                          !isAdmin && item?.user?.id !== userData?.id
                            ? "0"
                            : "4"
                        }
                      >
                        {(isAdmin || item?.user?.id === userData?.id) && (
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: check
                                ? Colors.PRIMARY_COLOR
                                : "#FF696D",
                              backgroundColor: check ? "#F0FAFF" : "#ffffff",
                              borderRadius: 5,
                              paddingHorizontal: horizontalScale(8),
                              paddingVertical: verticalScale(3),
                              marginRight: horizontalScale(8),
                            }}
                          >
                            <Text
                              style={{
                                color: check ? Colors.PRIMARY_COLOR : "#FF696D",
                                textAlign: "center",
                              }}
                            >
                              {check ? t("paid") : t("pending")}
                            </Text>
                          </View>
                        )}
                        {bcData[0].type === BcType.Private &&
                          item.memberType === "admin" && (
                            <View
                              mb={4}
                              style={{
                                borderWidth: 1,
                                borderColor: Colors.PRIMARY_COLOR,
                                backgroundColor: "#F0FAFF",
                                borderRadius: 5,
                                paddingHorizontal: horizontalScale(8),
                                paddingVertical: verticalScale(3),
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.PRIMARY_COLOR,
                                  fontFamily: Fonts.POPPINS_REGULAR,
                                }}
                              >
                                {"Admin"}
                              </Text>
                            </View>
                          )}
                        {!isAdmin &&
                          item?.openingPrecedence &&
                          item?.user.id === userData?.id && (
                            <Text
                              ml={"auto"}
                              color={
                                item?.bcMemberStatus === BcMemberStatus.Opened
                                  ? Colors.PRIMARY_COLOR
                                  : "grey"
                              }
                              fontFamily={Fonts.POPPINS_SEMI_BOLD}
                              fontSize={"sm"}
                            >
                              {item?.bcMemberStatus === BcMemberStatus.Opened &&
                                item?.bcMemberStatus}{" "}
                              {`#${item?.openingPrecedence}`}
                            </Text>
                          )}
                        {isAdmin && (
                          <Text
                            ml={"auto"}
                            color={
                              item?.bcMemberStatus === BcMemberStatus.Opened
                                ? Colors.PRIMARY_COLOR
                                : "grey"
                            }
                            fontFamily={Fonts.POPPINS_SEMI_BOLD}
                            fontSize={"sm"}
                          >
                            {item?.openingPrecedence &&
                            item?.bcMemberStatus === BcMemberStatus.Opened
                              ? `${item?.bcMemberStatus} #${item?.openingPrecedence}`
                              : ""}
                          </Text>
                        )}
                      </View>
                      <View
                        flexDirection="row"
                        alignItems="center"
                        alignContent={"center"}
                        justifyContent={"space-between"}
                      >
                        <View
                          flexDirection="row"
                          alignItems="center"
                          width="48"
                        >
                          <Avatar
                            bg="WHITE_COLOR"
                            size={"sm"}
                            source={{
                              uri:
                                item.user.profileImg ||
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                            }}
                          >
                            Image
                          </Avatar>
                          <Text
                            ml={3}
                            color="#06202E"
                            fontSize="md"
                            isTruncated={true}
                            maxWidth={horizontalScale(250)}
                            numberOfLines={1}
                            fontFamily={Fonts.POPPINS_SEMI_BOLD}
                          >
                            {item?.user?.fullName}
                          </Text>
                        </View>
                        {!isAdmin &&
                          item?.openingPrecedence &&
                          item?.user.id !== userData?.id && (
                            <Text
                              ml={"auto"}
                              color={
                                item?.bcMemberStatus === BcMemberStatus.Opened
                                  ? Colors.PRIMARY_COLOR
                                  : "grey"
                              }
                              fontFamily={Fonts.POPPINS_SEMI_BOLD}
                              fontSize={"sm"}
                            >
                              {item?.bcMemberStatus === BcMemberStatus.Opened &&
                                item?.bcMemberStatus}{" "}
                              {`#${item?.openingPrecedence}`}
                            </Text>
                          )}
                      </View>
                      {isAdmin && (
                        <View
                          style={{
                            marginTop: verticalScale(3),
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontFamily: Fonts.POPPINS_SEMI_BOLD,
                              }}
                            >
                              {t("phone")}:
                              <Text
                                style={{
                                  fontFamily: Fonts.POPPINS_MEDIUM,
                                }}
                              >
                                {item?.user?.phone}
                              </Text>
                            </Text>
                            <Text
                              numberOfLines={1}
                              isTruncated={true}
                              style={{
                                fontFamily: Fonts.POPPINS_SEMI_BOLD,
                              }}
                            >
                              {t("email")}:
                              <Text
                                style={{
                                  fontFamily: Fonts.POPPINS_MEDIUM,
                                }}
                              >
                                {item?.user?.email || "N/A"}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      )}
                      {(isAdmin || item?.user?.id === userData?.id) && (
                        <Button
                          isDisabled={bcData[0].status === BcStatus.Pending}
                          onPress={() => {
                            navigation.dispatch(
                              CommonActions.navigate("UserSchedule", {
                                member: item,
                                bcData: bcData[0],
                                userData,
                                getData,
                              })
                            );
                          }}
                          size="sm"
                          // alignSelf={'flex-end'}
                          // width={20}
                          variant={"solid"}
                          _pressed={{
                            backgroundColor: "DISABLED_COLOR",
                          }}
                          borderRadius={12}
                          mt={verticalScale(16)}
                          _text={{
                            color: "WHITE_COLOR",
                            fontFamily: Fonts.POPPINS_MEDIUM,
                          }}
                          backgroundColor={"PRIMARY_COLOR"}
                        >
                          {bcData[0].type === BcType.Private &&
                          item?.user?.id === userData?.id &&
                          !isAdmin
                            ? t("view_payments")
                            : t("pay_now")}
                        </Button>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            {/* </View> */}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={Colors.PRIMARY_COLOR} />
          </View>
        )}
      </View>
    );
  }, [bcData, BcMembers]);

  return (
    <>
      {/* {Expensive Long List Component} */}
      {MemoizedComponent}
      {/* {Modal to show that account is not jazz dost verified} */}
      {isJazzDostVerified === false && (
        <InfoModal
          onClose={() => {
            setButtonPressed(false);
            setIsJazzDostVerified(null);
          }}
          message="Please verify your account to join BC!"
          buttonText="OK"
          callback={handleCallback}
          Photo={Images.Err}
          isButtonPressed={isButtonPressed}
        />
      )}
    </>
  );
};

export default BcDetailsScreen;

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    width: "90%",
    bottom: 20,
    zIndex: 1,
  },
});
