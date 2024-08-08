import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { View, Text, Avatar, Button } from "native-base";
import Colors, { newColorTheme } from "../../constants/Colors";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Fonts, Images } from "../../constants";
import { apimiddleWare } from "../../utilities/helper-functions";
import { BcType } from "../../types/Enums";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import AppBar from "../../components/AppBar";

const getCurrentAndPreviousMonthsPayments = (data: any) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Month is zero-based
  const currentYear = currentDate.getFullYear();

  const filteredItems = data.filter((item: any) => {
    const itemDate = new Date(item.month);
    const itemMonth = itemDate.getMonth() + 1;
    const itemYear = itemDate.getFullYear();

    return (
      itemYear < currentYear ||
      (itemYear === currentYear && itemMonth <= currentMonth)
    );
  });

  return filteredItems;
};

const UserSchedule = () => {
  const route: any = useRoute();
  const navigation = useNavigation();
  const { member, bcData, userData }: any = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<number | null>(null);
  const [payments, setPayments] = useState<any[] | null>(null);

  const openEditModal = (index: number) => {
    setActiveModalItem(index);
  };

  const getPayments = async () => {
    try {
      const response = await apimiddleWare({
        url: `/bcs/payments/${member.id}`,
        method: "get",
      });

      if (response) {
        setPayments((prevPayments) => {
          const filteredPayments =
            getCurrentAndPreviousMonthsPayments(response);
          return filteredPayments;
        });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      // Handle error, e.g., show a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const changeStatus = async (index: number) => {
    setIsLoading(true);

    if (!payments) {
      setIsLoading(false);
      return;
    }

    const id = payments[index]?.id;

    if (!id) {
      setIsLoading(false);
      return;
    }

    const data = {
      paid: true,
    };

    try {
      const response = await apimiddleWare({
        url: `/bcs/payments/${id}`,
        method: "put",
        data: data,
      });

      if (response) {
        navigation.goBack();
        setActiveModalItem(null);
      }
    } catch (error) {
      // Handle error, e.g., show a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPayments();
    };

    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getPayments();
      return () => {
        // Cleanup function (if needed)
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.PRIMARY_COLOR} />
      </View>
    );
  }

  if (payments?.length === 0 || !payments) {
    return (
      <View
        flex={1}
        mx={horizontalScale(20)}
        alignItems={"center"}
        justifyContent={"center"}
        mt={6}
      >
        <Text>{t("no_payment_available")}</Text>
      </View>
    );
  }

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"}>
      <View px={horizontalScale(20)}>
        <AppBar name={t("user_schedule")} onPress={navigation.goBack} />
      </View>

      {member.payments?.length > 0 && (
        <FlatList
          data={payments}
          keyExtractor={(data, index) => index.toString()}
          contentContainerStyle={{
            paddingVertical: verticalScale(15),
          }}
          renderItem={({ item, index }) => {
            const date = new Date(item.month);
            const monthName = date.toLocaleString("default", { month: "long" });
            const datee = new Date(item?.paidAt);
            const options: any = {
              year: "numeric",
              month: "long",
              day: "numeric",
            };
            const formattedDate = datee.toLocaleDateString("en-US", options);

            return (
              <View
                key={index}
                mx={horizontalScale(20)}
                bg={"WHITE_COLOR"}
                borderRadius={12}
                p={3}
                mt={6}
                style={{
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: {
                    width: 10,
                    height: 2,
                  },
                  shadowRadius: 5,
                }}
              >
                <View
                  flexDirection="row"
                  alignItems="center"
                  justifyContent={"space-between"}
                >
                  <View flexDirection="row" alignItems="center">
                    <Avatar
                      bg="WHITE_COLOR"
                      size={"sm"}
                      source={{
                        uri:
                          member.user.profileImg ||
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                      }}
                    >
                      Image
                    </Avatar>
                    <Text
                      ml={3}
                      color="#06202E"
                      fontSize="lg"
                      isTruncated={true}
                      numberOfLines={1}
                      maxW={horizontalScale(150)}
                      fontFamily={Fonts.POPPINS_SEMI_BOLD}
                    >
                      {member.user.fullName}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderWidth: 1,
                      borderColor:
                        item.paid === true ? Colors.PRIMARY_COLOR : "#FF696D",
                      backgroundColor:
                        item.paid === true ? Colors.PRIMARY_COLOR : "#FF696D",
                      borderRadius: 5,
                      paddingVertical: verticalScale(1),
                      paddingHorizontal: horizontalScale(8),
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: verticalScale(12),
                      }}
                    >
                      {item.paid === true ? t("paid") : t("pending")}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: verticalScale(20),
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: Fonts.POPPINS_SEMI_BOLD,
                        fontSize: verticalScale(18),
                      }}
                    >
                      {t("bc_month")}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.POPPINS_REGULAR,
                        fontSize: verticalScale(15),
                        color: "#5A5A5C",
                      }}
                    >
                      {monthName}
                    </Text>
                  </View>
                  {item.paid === true ? (
                    <View>
                      <Text
                        style={{
                          fontFamily: Fonts.POPPINS_SEMI_BOLD,
                          fontSize: verticalScale(18),
                        }}
                      >
                        {t("paid_at")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.POPPINS_REGULAR,
                          fontSize: verticalScale(15),
                          color: "#5A5A5C",
                        }}
                      >
                        {formattedDate}
                      </Text>
                    </View>
                  ) : (
                    <Button
                      onPress={() => {
                        if (bcData.type === BcType.Public) {
                          navigation.dispatch(
                            CommonActions.navigate("SummaryScreen", {
                              bcData: bcData,
                              member,
                              item,
                            })
                          );
                        } else {
                          openEditModal(index);
                        }
                      }}
                      isDisabled={
                        bcData?.type === BcType.Private
                          ? bcData?.user?.id !== userData?.id
                          : false
                      }
                      size="sm"
                      variant={"solid"}
                      _pressed={{
                        backgroundColor: "DISABLED_COLOR",
                      }}
                      borderRadius={16}
                      _text={{
                        color: "WHITE_COLOR",
                        fontFamily: Fonts.POPPINS_MEDIUM,
                      }}
                      backgroundColor={"PRIMARY_COLOR"}
                      px={horizontalScale(30)}
                    >
                      {t("pay")}
                    </Button>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
      <Modal
        visible={activeModalItem !== null}
        transparent={true}
        animationType="slide"
      >
        <StatusBar
          backgroundColor={"rgba(0, 0, 0, 0.63)"}
          barStyle={"dark-content"}
        />
        <View flex={1} bg={"rgba(0, 0, 0, 0.63)"} justifyContent={"center"}>
          <View
            mx={horizontalScale(20)}
            bg={"WHITE_COLOR"}
            borderRadius={15}
            py={verticalScale(25)}
          >
            <View justifyContent={"center"} alignItems={"center"}>
              <Images.Payment />
              <Text
                mt={verticalScale(20)}
                color={"BLACK_COLOR"}
                fontSize={"2xl"}
                letterSpacing={1}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
              >
                {t("are_you_sure")}
              </Text>
              <Text
                color={"GREY"}
                fontSize={"sm"}
                fontFamily={Fonts.POPPINS_MEDIUM}
              >
                {t("pay_bc")}
              </Text>
            </View>
            <View mt={5} flexDirection={"row"} justifyContent={"center"}>
              <Button
                variant="solid"
                _text={{
                  color: "#FF696D",
                  fontFamily: Fonts.POPPINS_SEMI_BOLD,
                }}
                bgColor={"white"}
                borderColor={"#FF696D"}
                borderWidth={1}
                size={"md"}
                px={"7"}
                mr={2}
                borderRadius={10}
                onPress={() => {
                  setActiveModalItem(null);
                }}
              >
                {t("cancel")}
              </Button>
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
                px={"10"}
                borderRadius={10}
                isPressed={isLoading}
                onPress={() => {
                  changeStatus(activeModalItem as number);
                }}
              >
                {t("pay")}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserSchedule;

const styles = StyleSheet.create({});
