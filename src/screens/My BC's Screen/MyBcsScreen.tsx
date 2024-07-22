import {
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Share,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { View, Text, Avatar, Button, Pressable } from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import { Fonts, Images } from "../../constants";
import { BcStatus, BcType } from "../../lookups/Enums";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import Colors, { newColorTheme } from "../../constants/Colors";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setMembers } from "../../redux/members/membersSlice";
import { useTranslation } from "react-i18next";
import Message from '../../components/AlertMessage';

const MyBcsScreen = () => {
  const dispatch: any = useDispatch();
  const navigation = useNavigation();
  const [allBc, setAllBc] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [userDatas, setUserData] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const onShare = async (link: string) => {
    try {
      const result = await Share.share({
        message: link,
        // You can include title and url if needed
        // title: 'Bc Appa',
        // url: link,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error: any) {
      setModalVisible(true);
      // Alert.alert("Error sharing:", error);
    }
  };

  const buildLink = async (id: any) => {
    const link = await dynamicLinks().buildShortLink(
      {
        link: `https://invertase.io/offer?id=${id}`,
        domainUriPrefix: "https://bcappa.page.link",
        analytics: {
          campaign: "banner",
        },
        android: {
          packageName: "com.bcappa",
        },
      },
      dynamicLinks.ShortLinkType.DEFAULT
    );

    return link;
  };

  const getAllBc = async () => {
    setLoading(true);
    const getUserData: any = await AsyncStorage.getItem("loginUserData");
    const userData = await JSON.parse(getUserData);

    setUserData(userData);

    const response = await apimiddleWare({
      url: `/bcs/my`,
      method: "get",
      navigation,
      reduxDispatch: dispatch,
    });

    console.log(`All BCS: ${JSON.stringify(response)}`);

    if (response) {
      setAllBc(response);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    getAllBc();
  };

  const setColor = (status: any) => {
    switch (status) {
      case "active":
        return {
          col: "#02A7FD",
          bg: "#E6F6FF",
        };
      case "pending":
        return {
          col: "#FAC245",
          bg: "#FFF9EC",
        };
      case "complete":
        return {
          col: "#00D100",
          bg: "#C3FFC3",
        };
      default:
        return {
          col: "black",
          bg: "white",
        };
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllBc();
      return () => { };
    }, [])
  );

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} pt={verticalScale(15)}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      {modalVisible && (
        <Message
          Photo={() => <Images.AccountNotVerified />}
          message={t("Error_sharing")}
          buttonText={t("ok")}
          callback={() => setModalVisible(false)}
          secondButtonText={t("Cancel")}
          secondCallback={() => setModalVisible(false)}
          show={modalVisible}
        />
      )}
      <View mt={5} mx={horizontalScale(20)}>
        <Text
          fontSize={verticalScale(22)}
          color={"#06202E"}
          letterSpacing={0.2}
          fontFamily={Fonts.POPPINS_BOLD}
        >
          {t("my_bcs")}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          dispatch(setMembers([]));
          navigation.dispatch(CommonActions.navigate("NewBc"));
        }}
        style={{
          position: "absolute",
          bottom: verticalScale(20),
          right: horizontalScale(20),
          zIndex: 1,
          elevation: 100,
        }}
      >
        <Images.CreateBc
          width={horizontalScale(65)}
          height={verticalScale(60)}
        />
      </TouchableOpacity>
      {!loading ? (
        allBc.length > 0 ? (
          <FlatList
            data={allBc}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: verticalScale(30) }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
                colors={["#009387"]} // Customize the color of the loading indicator
              />
            }
            // keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              const { col, bg } = setColor(item.status);
              return (
                <View
                  key={index}
                  bg={"WHITE_COLOR"}
                  borderRadius={20}
                  mx={horizontalScale(20)}
                  py={2}
                  px={3}
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
                  }}
                >
                  <View
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <View
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <View
                        borderColor={col}
                        borderRadius={8}
                        borderWidth={1}
                        py={1}
                        px={2}
                        alignItems="center"
                        justifyContent="center"
                        bg={bg}
                      >
                        <Text color={col} fontFamily={Fonts.POPPINS_MEDIUM}>
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    {item.type === BcType.Private &&
                      item.user.id === userDatas.id && (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.dispatch(
                              CommonActions.navigate("UpdateBc", {
                                item,
                              })
                            );
                          }}
                        >
                          <Images.Pencil />
                        </TouchableOpacity>
                      )}

                    {item.type === BcType.Public &&
                      item.status === BcStatus.Pending && (
                        <TouchableOpacity
                          onPress={async () => {
                            try {
                              const link = await buildLink(item.id);
                              if (link) {
                                await onShare(link);
                              } else {
                                console.warn(
                                  "Invalid link returned from buildLink"
                                );
                              }
                            } catch (error: any) {
                              console.error("Error building link:", error);
                            }
                          }}
                        >
                          <Images.Send />
                        </TouchableOpacity>
                      )}
                  </View>
                  <View flexDirection={"row"} alignItems={"center"}>
                    <Text
                      mr={horizontalScale(3)}
                      color={"#06202E"}
                      fontFamily={Fonts.POPPINS_SEMI_BOLD}
                      fontSize={verticalScale(20)}
                    >
                      {item.title}
                    </Text>
                    {item.type === BcType.Private ? (
                      <Images.RedLock
                        width={horizontalScale(22)}
                        height={verticalScale(20)}
                      />
                    ) : (
                      <Images.Global
                        width={horizontalScale(22)}
                        height={verticalScale(20)}
                      />
                    )}
                  </View>
                  <Text
                    color={"PRIMARY_COLOR"}
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                    fontSize={verticalScale(20)}
                    mt={1}
                  >
                    {item.amount}{" "}
                    <Text
                      color={"#5A5A5C69"}
                      fontFamily={Fonts.POPPINS_REGULAR}
                    >
                      {t("per_month")}
                    </Text>
                  </Text>
                  <View
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    pl={horizontalScale(15)}
                    mt={verticalScale(5)}
                  >
                    <View flexDirection={"row"} alignItems="center">
                      <Avatar.Group
                        _avatar={{
                          size: "sm",
                        }}
                        max={3}
                      >
                        {[
                          "1494790108377-be9c29b29330",
                          "1603415526960-f7e0328c63b1",
                          "1607746882042-944635dfe10e",
                        ].map((item, index) => {
                          return (
                            <Avatar
                              key={index}
                              bg="green.500"
                              source={{
                                uri: `https://images.unsplash.com/photo-${item}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`,
                              }}
                            >
                              AJ
                            </Avatar>
                          );
                        })}
                      </Avatar.Group>
                      <Text
                        color={"#5A5A5C"}
                        fontFamily={Fonts.POPPINS_MEDIUM}
                        ml={2}
                        fontSize={verticalScale(17)}
                      >
                        {item?.totalMembers}/{item.maxMembers}
                      </Text>
                    </View>
                    <Button
                      onPress={() => {
                        navigation.dispatch(
                          CommonActions.navigate("BcDetailsScreen", {
                            item: item.id,
                            deeplink: false,
                          })
                        );
                      }}
                      size="md"
                      variant={"solid"}
                      borderRadius={12}
                      _text={{
                        color: "WHITE_COLOR",
                        fontFamily: Fonts.POPPINS_MEDIUM,
                      }}
                      _pressed={{
                        backgroundColor: "DISABLED_COLOR",
                      }}
                      backgroundColor={"PRIMARY_COLOR"}
                      px={horizontalScale(30)}
                    >
                      {t("details")}
                    </Button>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.genralContainer}>
            <Text
              style={{
                fontSize: verticalScale(20),
                fontFamily: Fonts.POPPINS_BOLD,
              }}
            >
              {t("no_bc_found")}
            </Text>
          </View>
        )
      ) : (
        <View style={styles.genralContainer}>
          <ActivityIndicator size={"large"} color={Colors.PRIMARY_COLOR} />
        </View>
      )}
    </View>
  );
};

export default MyBcsScreen;

const styles = StyleSheet.create({
  genralContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
