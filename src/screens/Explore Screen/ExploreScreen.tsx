import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useRef, useState, useCallback } from "react";
import { View, Text, Switch, Button } from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import { Fonts, Images, Colors } from "../../constants";
import { newColorTheme } from "../../constants/Colors";
import Swiper from "react-native-deck-swiper";
import StarRating from "react-native-star-rating-widget";
import { useDispatch } from "react-redux";
import { apimiddleWare } from "../../utilities/HelperFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import InfoModal from "../../components/InfoModal";
import { useTranslation } from "react-i18next";

const ExploreScreen = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const docRef: any = useRef();
  const dispatch: any = useDispatch();
  const [monthlyAmount, setMonthlyAmount] = useState(false);
  const [applyFilters, setApplyFilters] = useState(false);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [isButtonPressed, setButtonPressed] = useState(false);
  const [joined, setJoined] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingg, setIsLoadingg] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [user, setUser] = useState({
    userOne: "",
    userTwo: "",
  });

  // const onSwiped = useCallback(
  //   (index: number) => {
  //     const swipedCard = allUsers[index];
  //     const updatedCards = [...allUsers, swipedCard];
  //     setAllUsers(updatedCards);
  //     // console.log()
  //     // setIndex(index == allUsers.length - 1 ? 0 : index + 1);
  //     console.log({index});
  //   },
  //   [allUsers],
  // );

  const applyFiltersButton = () => {
    console.log(starRating, min, max, toggleSwitch);
  };
  const handleCallback = (payload: any) => {
    navigation.navigate("PersonalInformation");
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
  const getAllUsers = async () => {
    setIsLoadingg(true);
    const getUserData: any = await AsyncStorage.getItem("loginUserData");
    const userData = await JSON.parse(getUserData);

    if (!userData.monthlyAmount) {
      setMonthlyAmount(true);
    } else {
      const response = await apimiddleWare({
        url: "/bcs/public/users",
        method: "get",
      });

      if (response) {
        setAllUsers(shuffleAndMoveLastArrayItems(response));
        setIsLoadingg(false);
      }
      setIsLoadingg(false);
    }
  };
  // const check = async (index: any) => {
  //   const newAllUsers = await allUsers.filter((user: any) => user.id !== id);
  //   setAllUsers(newAllUsers);

  //   const swipedCard: any = allUsers[index];
  //   // console.log({swipedCard});
  //   const {id} = allUsers[index];
  //   const data = {
  //     otherUserId: id,
  //   };
  //   const response = await apimiddleWare({
  //     url: '/bcs/handle-swipes',
  //     method: 'post',
  //     data: data,
  //     reduxDispatch: dispatch,
  //   });

  //   if (response) {
  //     console.log({response});
  //     if (response?.status === 'matched') {
  //       console.log({status: response?.status});
  //       setUser({
  //         userOne: response.userOne.fullName,
  //         userTwo: response.userTwo.fullName,
  //       });
  //       setJoined(true);
  //     }
  //   }
  // };

  const handleRightSwipe = useCallback(
    async (index: any) => {
      const newAllUsers = await allUsers.filter((user: any) => user.id !== id);
      setAllUsers(newAllUsers);

      const swipedCard: any = allUsers[index];
      // console.log({swipedCard});
      const { id } = allUsers[index];
      const data = {
        otherUserId: id,
      };
      const response = await apimiddleWare({
        url: "/bcs/handle-swipes",
        method: "post",
        data: data,
        reduxDispatch: dispatch,
      });

      if (response) {
        console.log({ response });
        if (response?.status === "matched") {
          console.log({ status: response?.status });
          setUser({
            userOne: response.userOne.fullName,
            userTwo: response.userTwo.fullName,
          });
          setJoined(true);
        }
      }
    },
    [allUsers]
  );

  const handleLeftSwipe = useCallback(
    (index: number) => {
      const swipedCard = allUsers[index];
      const updatedCards = [...allUsers, swipedCard];
      console.log({ up: updatedCards.length });
      setAllUsers(updatedCards);
      // setCurrentIndex(currentIndex === allUsers.length - 1 ? 0 : index + 1);
      console.log({ index });
    },
    [allUsers]
  );

  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen1 is focused");
      getAllUsers();
      return () => {
        console.log("Screen1 is unfocused");
      };
    }, [])
  );

  const shuffleAndMoveLastArrayItems = (array: number[]): number[] => {
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
        <TouchableOpacity onPress={() => setApplyFilters(true)}>
          <Images.Filter />
        </TouchableOpacity>
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
        {!isLoadingg && allUsers.length > 0 && (
          <Swiper
            ref={docRef}
            cards={allUsers}
            disableLeftSwipe={allUsers.length === 1}
            // keyExtractor={(item: any) => item.id}
            renderCard={(order: any) => {
              console.log({ total: allUsers.length });
              return (
                <View style={[styles.card]}>
                  <ImageBackground
                    source={{
                      uri:
                        order.profileImg != null
                          ? order.profileImg
                          : "https://res.cloudinary.com/didbvjb3m/image/upload/v1697800339/uqn2rc2plzmmzfnneqfo.png",
                    }}
                    resizeMode="cover"
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    {/* {order.swiper.length > 0 && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: Colors.PRIMARY_COLOR,
                          backgroundColor: Colors.PRIMARY_COLOR,
                          borderRadius: 5,
                          alignSelf: 'flex-end',
                          margin: verticalScale(10),
                          paddingVertical: verticalScale(5),
                          paddingHorizontal: horizontalScale(10),
                        }}>
                        <Text
                          style={{
                            color: 'white',
                          }}>
                          Swiped
                        </Text>
                      </View>
                    )} */}
                    <View
                      position="absolute"
                      bottom={verticalScale(-30)}
                      left={horizontalScale(20)}
                    >
                      <Text
                        color={"WHITE_COLOR"}
                        fontFamily={Fonts.POPPINS_BOLD}
                        fontSize={verticalScale(35)}
                      >
                        {order?.fullName}
                      </Text>
                      <View flexDirection="row" alignItems={"center"}>
                        <StarRating
                          rating={4}
                          maxStars={5}
                          starSize={25}
                          enableHalfStar={true}
                          emptyColor={"#D9D9D9"}
                          starStyle={{
                            marginRight: 0,
                            padding: 0,
                            marginLeft: 0,
                            marginTop: 0,
                            marginBottom: 0,
                          }}
                          onChange={() => {}}
                        />
                        <Text
                          ml={2}
                          color={"WHITE_COLOR"}
                          fontFamily={Fonts.POPPINS_SEMI_BOLD}
                        >
                          (4)
                        </Text>
                      </View>
                      {/* <Text
                        mt={1}
                        color={'WHITE_COLOR'}
                        fontFamily={Fonts.POPPINS_SEMI_BOLD}
                        fontSize={verticalScale(18)}>
                        18 Committees
                      </Text> */}
                      <Text
                        mt={1}
                        color={"WHITE_COLOR"}
                        fontFamily={Fonts.POPPINS_SEMI_BOLD}
                        fontSize={verticalScale(18)}
                      >
                        RS: {order?.monthlyAmount || "0"}
                      </Text>
                      <View height={20} />
                    </View>
                    {/* <View
                      position="absolute"
                      bottom={5}
                      alignItems="center"
                      justifyContent="space-around"
                      flexDirection={'row'}
                      alignSelf="center"
                      width="50%">
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          docRef.current.swipeLeft();
                        }}>
                        <Images.CardCancel
                          width={verticalScale(60)}
                          height={verticalScale(60)}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          docRef.current.swipeRight();
                        }}>
                        <Images.CardAdd
                          width={verticalScale(60)}
                          height={verticalScale(60)}
                        />
                      </TouchableOpacity>
                    </View> */}
                  </ImageBackground>
                  <View
                    bg={"WHITE_COLOR"}
                    style={{
                      padding: verticalScale(8),
                      elevation: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 10,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                    }}
                  >
                    <View
                      // position="absolute"
                      // bottom={5}
                      alignItems="center"
                      justifyContent="space-around"
                      flexDirection={"row"}
                      alignSelf="center"
                      width="50%"
                    >
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          allUsers.length > 1 && docRef.current.swipeLeft();
                        }}
                      >
                        <Images.CardCancel
                          width={verticalScale(60)}
                          height={verticalScale(60)}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          docRef.current.swipeRight();
                        }}
                      >
                        <Images.CardAdd
                          width={verticalScale(60)}
                          height={verticalScale(60)}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
            onSwipedLeft={(index: any) => {
              // onSwiped(index);
              // console.log(index);
              handleLeftSwipe(index);
            }}
            onSwipedRight={(index: any) => {
              // onSwiped(index);
              // console.log(index);
              handleRightSwipe(index);
            }}
            // onSwiped={index => {
            //   // onSwiped(index);
            // }}
            stackSize={3}
            stackSeparation={8}
            cardIndex={0}
            swipeAnimationDuration={500}
            verticalSwipe={false}
            backgroundColor={"transparent"}
            horizontalSwipe={true}
          />
        )}

        {!isLoadingg && allUsers.length === 0 && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
        )}
      </View>

      <Modal visible={applyFilters} transparent animationType="slide">
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
                  // setMin(0);
                  // setMax(50000);

                  setApplyFilters(false);
                }}
              >
                <Images.Cross />
              </TouchableOpacity>
            </View>
            {/* range */}
            {/* <View mt={7}> */}
            {/* <Text
                color={'BLACK_COLOR'}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={'xl'}>
                Amount Range
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: verticalScale(15),
                }}>
                <Text style={styles.minmax}>{min}</Text>
                <Text style={styles.minmax}>{max}</Text>
              </View> */}

            {/* <View> */}
            {/* <RangeSlider
                style={{
                  marginTop: verticalScale(20),
                }}
                range={[min, max]} // set the current slider's value
                minimumValue={0} // Minimum value
                maximumValue={5000} // Maximum value
                step={500} // The step for the slider (0 means that the slider will handle any decimal value within the range [min, max])
                minimumRange={1000} // Minimum range between the two thumbs (defaults as "step")
                crossingAllowed={false} // If true, the user can make one thumb cross over the second thumb
                outboundColor={'#CACACA'} // The track color outside the current range value
                inboundColor={Colors.PRIMARY_COLOR} // The track color inside the current range value
                thumbTintColor={Colors.PRIMARY_COLOR} // The color of the slider's thumb
                thumbStyle={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                }} // Override the thumb's style
                vertical={false} // If true, the slider will be drawn vertically
                inverted={false} // If true, min value will be on the right, and max on the left
                enabled={true} // If false, the slider won't respond to touches anymore
                trackHeight={4} // The track's height in pixel
                thumbSize={15} // The thumb's size in pixel
                slideOnTap={true} // If true, touching the slider will update it's value. No need to slide the thumb.
                onValueChange={value => {
                  console.log({value});
                }} // Called each time the value changed. The type is (range: [number, number]) => void
                onSlidingStart={undefined} // Called when the slider is pressed. The type is (range: [number, number]) => void
                onSlidingComplete={start => {
                  console.log({start});
                  setMin(start[0]);
                  setMax(start[1]);
                }} // Called when the press is released. The type is (range: [number, number]) => void
                CustomThumb={({value: number, thumb}) => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        margin: 0,
                        marginBottom: verticalScale(20),
                      }}>
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 20,
                          backgroundColor: Colors.PRIMARY_COLOR,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            width: 9,
                            height: 9,
                            backgroundColor: 'white',
                            borderRadius: 15,
                          }}
                        />
                      </View>
                      <Text>{thumb}</Text>
                    </View>
                  );
                }} // Provide your own component to render the thumb. The type is a component: ({ value: number, thumb: 'min' | 'max' }) => JSX.Element
                CustomMark={undefined} // Provide your own component to render the marks. The type is a component: ({ value: number; active: boolean }) => JSX.Element ; value indicates the value represented by the mark, while active indicates wether a thumb is currently standing on the mark
                // {...props} // Add any View Props that will be applied to the container (style, ref, etc)
              /> */}
            {/* </View> */}
            {/* range end */}
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
              // isLoadingText="Logging in"
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
              // isDisabled={isLoading}
              isPressed={isLoading}
              onPress={() => {
                applyFiltersButton();
              }}
            >
              {t("apply_filters")}
            </Button>
          </View>
        </View>
      </Modal>
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

export default ExploreScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.63)',
  },
  modalView: {
    paddingTop: verticalScale(10),
    backgroundColor: 'white',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    width: '100%',
    height: verticalScale(320),
    paddingHorizontal: horizontalScale(20),
  },
  minmax: {
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(16),
  },
});
