import { StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { View, Text, Switch, Button } from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Fonts, Images, Colors } from "../../constants";
import { newColorTheme } from "../../constants/Colors";
import Swiper from "react-native-deck-swiper";
import { useDispatch } from "react-redux";
import { apimiddleWare } from "../../utilities/helper-functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import InfoModal from "../../components/InfoModal";
import { useTranslation } from "react-i18next";
import MatchCard from "../../components/MatchCard";
import { useAppDispatch } from "../../hooks/hooks";
import useAxios from "../../hooks/useAxios";

type SwipeResponse = {
  status: string;
  userOne: {
    fullName: string;
  };
  userTwo: {
    fullName: string;
  };
};
const ExploreScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const docRef = useRef<Swiper<User>>(null);
  const [monthlyAmount, setMonthlyAmount] = useState(false);
  const [isButtonPressed, setButtonPressed] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isLoadingg, setIsLoadingg] = useState(false);
  const [publicUsers, setPublicUsers] = useState<User[]>([]);
  const [user, setUser] = useState({
    userOne: "",
    userTwo: "",
  });
  const [remainingCards, setRemainingCards] = useState(0);

  const handleCallback = (payload: any) => {
    navigation.dispatch(CommonActions.navigate("PersonalInformation"));
    setMonthlyAmount(false);
    setButtonPressed(false);
  };

  const joinedCallback = () => {
    setJoined(false);
    setButtonPressed(true);
    setUser({
      userOne: "",
      userTwo: "",
    });
  };
  const [users, userStart] = useAxios<User[]>("/bcs/public/users", "get", {
    "Request failed": "Invalid request data. Please check your input.",
  });
  const getAllUsers = async () => {
    const getUserData: any = await AsyncStorage.getItem("loginUserData");
    const userData = await JSON.parse(getUserData);
    console.log("userData:", userData);

    if (!userData.monthlyAmount) {
      setMonthlyAmount(true);
    } else {
      await userStart();
      console.log("start");
    }
  };

  useEffect(() => {
    console.log("Users state:", users);
    if (users) {
      const shuffledUsers = shuffleAndMoveLastArrayItems(users);
      setPublicUsers(shuffledUsers);
      setRemainingCards(shuffledUsers.length);
      console.log("length", shuffledUsers.length);
    } else {
      console.log("loading");
    }
  }, [users]);

  useFocusEffect(
    useCallback(() => {
      getAllUsers();
    }, [])
  );
  const [data, start] = useAxios<SwipeResponse>("/bcs/handle-swipes", "post", {
    "Request failed": "Invalid request data. Please check your input.",
  });

  const handleRightSwipe = async (index: number) => {
    setRemainingCards(remainingCards - 1);

    const requestData = { otherUserId: publicUsers[index].id };
    try {
      start({ data: requestData });

      console.log(`Swiped Response: ${JSON.stringify(data)}`);

      if (data) {
        if (data?.status === "joined") {
          setUser({
            userOne: data.userOne.fullName,
            userTwo: data.userTwo.fullName,
          });
          setJoined(true);
        }
      }
    } catch (error) {
      console.error("Error handling swipe:", error);
    }
  };
  const handleLeftSwipe = (index: number) => {
    setPublicUsers([...publicUsers, publicUsers[index]]);
  };

  const shuffleAndMoveLastArrayItems = (array: User[]): User[] => {
    const arrayLength = array.length;

    if (arrayLength < 2) {
      return array; // Return the original array if it has less than 2 elements
    }

    // Determine the number of elements to replace (between 2 and 5)
    const replaceCount = Math.min(
      5,
      Math.max(2, Math.floor(Math.random() * 4) + 2)
    );

    // Take the last elements to replace
    const lastElementsToReplace = array.slice(-replaceCount);

    // Shuffle the last elements with no duplication
    const uniqueSet = new Set(lastElementsToReplace);
    const shuffledLastElements = Array.from(uniqueSet);

    for (let i = shuffledLastElements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledLastElements[i], shuffledLastElements[j]] = [
        shuffledLastElements[j],
        shuffledLastElements[i],
      ];
    }

    // Create a new array with shuffled last elements moved to the beginning
    const newArray = [
      ...shuffledLastElements,
      ...array.slice(0, -replaceCount),
    ];

    return newArray;
  };

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} pt={verticalScale(15)}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />

      <View
        mt={5}
        mx={horizontalScale(22)}
        flexDirection={"row"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontSize={verticalScale(22)}
          color={"#06202E"}
          letterSpacing={0.2}
          fontFamily={Fonts.POPPINS_BOLD}
        >
          {t("explore")}
        </Text>
        {/* <TouchableOpacity onPress={() => setApplyFilters(true)}>
          <Images.Filter />
        </TouchableOpacity> */}
      </View>

      <View style={styles.cardContainer}>
        {isLoadingg && (
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

        {!isLoadingg &&
          (remainingCards > 0 ? (
            <Swiper
              ref={docRef}
              cards={publicUsers}
              keyExtractor={(it) => it.id}
              renderCard={(user, index) => {
                return (
                  /**
                   * The setTimeout is added because the touch event interrupts swiper swipe animations.
                   */
                  <MatchCard
                    user={user}
                    isCancellable={publicUsers.length - 1 - index !== 0}
                    onAdd={() => {
                      setTimeout(() => {
                        docRef.current?.swipeRight();
                      }, 100);
                    }}
                    onCancel={() => {
                      setTimeout(() => {
                        docRef.current?.swipeLeft();
                      }, 100);
                    }}
                  />
                );
              }}
              onSwipedLeft={(i) => handleLeftSwipe(i)}
              onSwipedRight={(i) => handleRightSwipe(i)}
              stackSize={3}
              stackSeparation={8}
              cardIndex={0}
              verticalSwipe={false}
              horizontalSwipe={true}
              disableLeftSwipe={remainingCards <= 1}
              backgroundColor={"transparent"}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: verticalScale(20),
                  fontFamily: Fonts.POPPINS_BOLD,
                }}
              >
                {t("no_user_available_swipe")}
              </Text>
            </View>
          ))}
      </View>

      {/* <Modal visible={applyFilters} transparent animationType="slide">
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={"rgba(0, 0, 0, 0.63)"}
        />

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View flexDirection={"row"} alignItems={"center"}>
              <Text
                textAlign="center"
                flex={1}
                color={"BLACK_COLOR"}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={"xl"}
              >
                {t("filters")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setApplyFilters(false);
                }}
              >
                <Images.Cross />
              </TouchableOpacity>
            </View>
            <View mt={7}>
              <Text
                color={"BLACK_COLOR"}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={"lg"}
              >
                {t("ratings")}
              </Text>
              <StarRating
                rating={starRating}
                maxStars={5}
                starSize={35}
                enableHalfStar={true}
                emptyColor={"#D9D9D9"}
                starStyle={{
                  marginRight: 0,
                  padding: 0,
                  marginLeft: 0,
                  marginTop: 5,
                  marginBottom: 0,
                }}
                onChange={(rating) => {
                  console.log({ rating });
                  setStarRating(rating);
                }}
              />
            </View>
            <View
              mt={4}
              flexDirection={"row"}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                color={"BLACK_COLOR"}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={"md"}
              >
                {t("only_show_nearby_users")}
              </Text>
              <Switch
                value={toggleSwitch}
                size="md"
                onTrackColor="PRIMARY_COLOR"
                onValueChange={() => {
                  setToggleSwitch(!toggleSwitch);
                }}
                defaultIsChecked={toggleSwitch}
              />
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
              mt={verticalScale(50)}
              p={"4"}
              borderRadius={16}
              isPressed={isLoading}
              onPress={() => {
                applyFiltersButton();
              }}
            >
              {t("apply_filters")}
            </Button>
          </View>
        </View>
      </Modal> */}

      {monthlyAmount && (
        <InfoModal
          message={t("please_set_monthly_amount")}
          buttonText="OK"
          callback={handleCallback}
          Photo={Images.Err}
          isButtonPressed={isButtonPressed}
        />
      )}
      {joined && (
        <InfoModal
          message={`${t("you_have_match")} ${user.userTwo}`}
          buttonText="OK"
          callback={joinedCallback}
          Photo={Images.Congratulations}
          isButtonPressed={isButtonPressed}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.63)",
  },
  modalView: {
    paddingTop: verticalScale(10),
    backgroundColor: "white",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    width: "100%",
    height: verticalScale(320),
    paddingHorizontal: horizontalScale(20),
  },
  minmax: {
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(16),
  },
});

export default ExploreScreen;
