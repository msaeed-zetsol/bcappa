import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  Avatar,
  Button,
  Pressable,
  Modal,
  Skeleton,
  HStack,
  VStack,
} from 'native-base';
import { Fonts } from '../../constants';
import { verticalScale, horizontalScale } from '../../utilities/Dimensions';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Colors, { newColorTheme } from '../../constants/Colors';
import InfoModal from '../../components/InfoModal';
import { BcStatus, BcType, modalEnums } from '../../lookups/Enums';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '../../interface/Interface';
import {
  apimiddleWare,
  getFirstAndLastCharsUppercase,
} from '../../utilities/HelperFunctions';
import { useDispatch } from 'react-redux';
import Reward from '../../assets/svg/Reward';
import People from '../../assets/svg/People';
import Finance from '../../assets/svg/Finance';
import HoldingHeart from '../../assets/svg/HoldingHeart';
import CreateBc from '../../assets/svg/CreateBc';
import Congratulations from '../../assets/svg/Congratulations';
import AccountNotVerified from '../../assets/svg/Account_Not_Verified';
import CommimgSoonIcon from '../../assets/svg/CommingSoon';

const HomeScreen = () => {
  const route: any = useRoute();
  const show = route?.params?.show;
  const dispatch: any = useDispatch();
  const [firstSignup, setFirstSignup] = useState(false);
  const [modals, setModals] = useState({
    accountVerification: false,
    commingSoon: false,
  });
  const [isButtonPressed, setButtonPressed] = useState(false);
  const [userInfo, setUserInfo] = useState<Profile>();
  const [activeBc, setActiveBc] = useState<any>([]);
  const [isEngSelected, setIsEngSelected] = useState(true);
  const [load, setLoad] = useState(false);
  const navigation: any = useNavigation();
  const [swiperData, setSwiperData] = useState<any>([]);
  const [activeLoad, setActiveLoad] = useState(false);
  const AvatarName = getFirstAndLastCharsUppercase(userInfo?.fullName || '');

  const handleCallback = (payload: any) => {
    setButtonPressed(true);

    if (payload.name === modalEnums.ACCOUNT_NOT_VERIFIED) {
      setButtonPressed(false);
      setModals(prevData => ({
        ...prevData,
        accountVerification: !payload.value,
      }));
      navigation.navigate('JazzDostVerification');
    }
    if (payload.name === modalEnums.COMMING_SOON) {
      setButtonPressed(false);
      setModals(prevData => ({
        ...prevData,
        commingSoon: !payload.value,
      }));
    }
  };
  const getActiveBc = async () => {
    setActiveLoad(true);
    const getUserData: any = await AsyncStorage.getItem('loginUserData');
    const userData = await JSON.parse(getUserData);
    setUserInfo(userData);
    const response = await apimiddleWare({
      url: `/bcs/active`,
      method: 'get',
      reduxDispatch: dispatch,
      navigation,
    });
    if (response) {
      setActiveBc(response);
      setActiveLoad(false);
      // setLoad(false);
    }
  };
  const scrollingContainer = async () => {
    setLoad(true);
    // const getUserData: any = await AsyncStorage.getItem('loginUserData');
    // const userData = await JSON.parse(getUserData);
    const response = await apimiddleWare({
      url: `/bcs/ready-to-join`,
      method: 'get',
      reduxDispatch: dispatch,
      navigation,
    });
    if (response) {
      setSwiperData(response);
      setLoad(false);
    }
    // setLoad(false);
  };

  const joinBc = async (id: any) => {
    navigation.navigate('BcDetailsScreen', {
      item: id,
      deeplink: false,
    });
  };

  useFocusEffect(
    useCallback(() => {
      getActiveBc();
      scrollingContainer();
    }, []),
  );

  useEffect(() => {
    if (show) {
      setFirstSignup(true);
    }
  }, []);
  return (
     <ScrollView
    contentContainerStyle={{ flexGrow: 10 ,paddingHorizontal: verticalScale(15),backgroundColor: newColorTheme.BACKGROUND_COLOR,paddingBottom: verticalScale(15)}}
    >
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
        animated={true}
      />
      <View
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <View flexDirection={'row'} alignItems={'center'}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('ProfileScreen');
            }}>
            {userInfo?.profileImg ? (
              <Avatar
                bg="WHITE_COLOR"
                size={'md'}
                source={{
                  uri: userInfo?.profileImg
                    ? userInfo?.profileImg
                    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}>
                Image
              </Avatar>
            ) : (
              <Avatar bg="amber.500" size="md">
                {AvatarName}
              </Avatar>
            )}
          </TouchableOpacity>
          <View ml={2}>
            <Text
              fontFamily={Fonts.POPPINS_MEDIUM}
              fontSize={verticalScale(17)}
              color={'#5A5A5C'}>
              Hi, Welcome!
            </Text>
            <View flexDirection={'row'} alignItems={'center'} width={'85%'}>
              <Text
                isTruncated={true}
                maxWidth={horizontalScale(150)}
                color={'PRIMARY_COLOR'}
                fontFamily={Fonts.POPPINS_MEDIUM}
                numberOfLines={1}
                fontSize={'sm'}>
                {userInfo?.fullName}
              </Text>
              <Reward />


            </View>
          </View>
        </View>
        <View style={styles.Togglecontainer}>
          <TouchableOpacity onPress={() => setIsEngSelected(true)}>
            <Text
              style={[
                styles.text,
                isEngSelected ? styles.selectedText : styles.unSelectedText,
                {
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                },
              ]}>
              Eng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEngSelected(false)}>
            <Text
              style={[
                styles.text,
                !isEngSelected ? styles.selectedText : styles.unSelectedText,
                {
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                },
              ]}>
              اردو
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {load && (
        <HStack
          style={{
            paddingHorizontal: horizontalScale(10),
            borderRadius: 15,
          }}
          mt={6}
          w="100%"
          // maxW="400"
          borderWidth="1"
          space={8}
          py={verticalScale(30)}
          _dark={{
            borderColor: 'coolGray.500',
          }}
          _light={{
            borderColor: 'coolGray.200',
          }}>
          <VStack flex="3" space="4">
            <Skeleton h={'3'} rounded="full" />
            <Skeleton h={'3'} rounded="full" />

            {/* <Skeleton.Text /> */}
            <HStack space="2" alignItems="center">
              <HStack flex={'1'} alignItems="flex-start">
                <Skeleton size="5" rounded="full" />
                <Skeleton size="5" rounded="full" />
                <Skeleton size="5" rounded="full" />
              </HStack>
              {/* <Skeleton h="3" flex="2" rounded="full" /> */}
              <Skeleton h="3" flex="1" rounded="full" startColor="#e5f6fe" />
            </HStack>
          </VStack>
        </HStack>
      )}
      {!load && swiperData.length > 0 && (
        <>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SeeAll', {
                name: 'Public Bc',
                api: '/bcs/ready-to-join',
                btn: 'join',
              });
            }}
            style={{
              alignSelf: 'flex-end',
            }}>
            <Text
              style={{
                marginTop: 6,
                color: 'PRIMARY_COLOR',
                marginHorizontal: horizontalScale(5),
              }}>
              See all
            </Text>
          </TouchableOpacity>

          <View
            bg={'WHITE_COLOR'}
            borderRadius={20}
            height={verticalScale(170)}
            p={5}
            mt={1}
            style={{
              elevation: 5,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: {
                width: 10,
                height: 2,
              },
              shadowRadius: 5,
            }}>
            <Swiper
              pagingEnabled={true}
              // autoplay=.{true} // Set to true for automatic sliding
              // autoplayTimeout={2} // Time in seconds for each slide
              dotStyle={styles.dot} // Customize the inactive dot style
              activeDotStyle={styles.activeDot} // Customize the active dot style
            >
              {swiperData.map((item: any) => {
                return (
                  <View key={item.id} style={{ flex: 1 }}>
                    <Text
                      color={'#06202E'}
                      isTruncated={true}
                      numberOfLines={1}
                      fontFamily={Fonts.POPPINS_SEMI_BOLD}
                      fontSize={verticalScale(20)}>
                      {item?.title}
                    </Text>
                    <Text
                      color={'PRIMARY_COLOR'}
                      fontFamily={Fonts.POPPINS_SEMI_BOLD}
                      fontSize={verticalScale(20)}
                      mt={2}>
                      {item?.amount}{' '}
                      <Text
                        color={'#5A5A5C69'}
                        fontFamily={Fonts.POPPINS_REGULAR}>
                        / Month
                      </Text>
                    </Text>
                    <View
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      pl={horizontalScale(15)}
                      mt={verticalScale(10)}>
                      <View flexDirection={'row'} alignItems="center">
                        <Avatar.Group
                          _avatar={{
                            size: 'sm',
                          }}
                          max={3}>
                          {[
                            '1494790108377-be9c29b29330',
                            '1603415526960-f7e0328c63b1',
                            '1607746882042-944635dfe10e',
                          ].map((item, index) => {
                            return (
                              <Avatar
                                key={index}
                                bg="green.500"
                                source={{
                                  uri: `https://images.unsplash.com/photo-${item}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`,
                                }}>
                                AJ
                              </Avatar>
                            );
                          })}
                        </Avatar.Group>
                        <Text
                          color={'#5A5A5C'}
                          fontFamily={Fonts.POPPINS_MEDIUM}
                          ml={2}
                          fontSize={verticalScale(17)}>
                          {item?.totalMembers}/{item?.maxMembers}
                        </Text>
                      </View>
                      <Button
                        onPress={() => {
                          joinBc(item.id);
                        }}
                        size="sm"
                        variant={'solid'}
                        _pressed={{
                          backgroundColor: 'DISABLED_COLOR',
                        }}
                        borderRadius={12}
                        _text={{
                          color: 'WHITE_COLOR',
                          fontFamily: Fonts.POPPINS_MEDIUM,
                        }}
                        backgroundColor={'PRIMARY_COLOR'}
                        px={horizontalScale(30)}>
                        Join
                      </Button>
                    </View>
                  </View>
                );
              })}
            </Swiper>
          </View>
        </>
      )}
      {!load && swiperData.length == 0 && (
        <View
          mt={6}
          bg={'WHITE_COLOR'}
          borderRadius={20}
          flexDirection="row"
          justifyContent="space-around"
          alignItems={'center'}
          p={5}
          style={{
            elevation: 5, // Elevation level (adjust as needed)
            shadowColor: '#000', // Shadow color
            shadowOpacity: 0.2, // Shadow opacity (adjust as needed)
            shadowOffset: {
              width: 10, // Horizontal offset of the shadow
              height: 2, // Vertical offset of the shadow
            },
            shadowRadius: 5,
          }}>
          <View width={'50%'}>
            <Text
              color={'#06202E'}
              fontFamily={Fonts.POPPINS_MEDIUM}
              fontSize={verticalScale(15)}>
              There is no BC to join
            </Text>
            {/* <Button
            onPress={() => {
              setModals((prevState: any) => ({
                ...prevState,
                accountVerification: true,
              }));
            }}
            width={'80%'}
            mt={verticalScale(5)}
            size={'md'}
            variant={'solid'}
            borderRadius={12}
            _pressed={{
              backgroundColor: 'DISABLED_COLOR',
            }}
            _text={{
              color: 'WHITE_COLOR',
              fontFamily: Fonts.POPPINS_MEDIUM,
            }}
            backgroundColor={'PRIMARY_COLOR'}>
            Explore Now
          </Button> */}
          </View>
          <View>
          <People/>
            
          </View>
        </View>
      )}
      <View
        flexDirection="row"
        justifyContent="space-between"
        height={verticalScale(140)}
        mt={verticalScale(20)}>
        <Pressable
          style={{
            elevation: 8,
          }}
          bg={'#0398E5'}
          height={verticalScale(130)}
          width={'48%'}
          borderRadius={12}
          _pressed={{
            // backgroundColor: 'DISABLED_COLOR',
            opacity: 0.8,
          }}
          onPress={() => {
            setModals((prevData: any) => ({
              ...prevData,
              commingSoon: true,
            }));
          }}>
          <ImageBackground
            source={require('../../assets/Mask_Blue.png')}
            resizeMode="cover"
            style={{
              height: verticalScale(130),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <HoldingHeart />
            <Text
              color={'WHITE_COLOR'}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}
              mt={2}>
              Insurance
            </Text>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={{
            elevation: 8,
          }}
          bg={'#FF696D'}
          height={verticalScale(130)}
          width={'48%'}
          borderRadius={12}
          _pressed={{
            opacity: 0.8,
          }}
          onPress={() => {
            setModals((prevData: any) => ({
              ...prevData,
              commingSoon: true,
            }));
          }}>
          <ImageBackground
            source={require('../../assets/Mask_Red.png')}
            resizeMode="cover"
            style={{
              height: verticalScale(130),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Finance/>
            
            <Text
              color={'WHITE_COLOR'}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}
              mt={2}>
              Finance Market
            </Text>
          </ImageBackground>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: verticalScale(3),
        }}>
        <Text
          color={'#06202E'}
          fontSize={verticalScale(18)}
          fontFamily={Fonts.POPPINS_SEMI_BOLD}>
          Active BCs
        </Text>
        {!activeLoad && activeBc.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SeeAll', {
                name: 'Active Bcs',
                api: '/bcs/active',
                btn: 'details',
              });
            }}
            style={{
              alignSelf: 'flex-end',
            }}>
            <Text
              style={{
                color: 'PRIMARY_COLOR',
                marginHorizontal: horizontalScale(5),
                fontFamily: Fonts.POPPINS_REGULAR,
              }}>
              See all
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {activeLoad && (
        <View
          style={{
            flexDirection: 'row',
          }}>
          {['', ''].map((item, index) => {
            return (
              <HStack
                key={index}
                mt={2}
                mr={2}
                w="50%"
                borderWidth="1"
                space={8}
                rounded="md"
                _dark={{
                  borderColor: 'coolGray.500',
                }}
                _light={{
                  borderColor: 'coolGray.200',
                }}
                p="4">
                <VStack flex="1" space="4">
                  <Skeleton startColor={'#e5f6fe'} />
                  <Skeleton size="5" rounded="full" w="100%" />
                  <Skeleton size="5" w="100%" rounded="full" />
                </VStack>
              </HStack>
            );
          })}
        </View>
      )}
      {!activeLoad && activeBc.length == 0 && (
        <View
          bg={'WHITE_COLOR'}
          borderRadius={20}
          flexDirection="row"
          justifyContent="space-around"
          alignItems={'center'}
          p={5}
          style={{
            elevation: 5, // Elevation level (adjust as needed)
            shadowColor: '#000', // Shadow color
            shadowOpacity: 0.2, // Shadow opacity (adjust as needed)
            shadowOffset: {
              width: 10, // Horizontal offset of the shadow
              height: 2, // Vertical offset of the shadow
            },
            shadowRadius: 5,
          }}>
          <View width={'50%'}>
            <Text
              color={'#06202E'}
              fontFamily={Fonts.POPPINS_MEDIUM}
              fontSize={verticalScale(15)}>
              You don’t have any active BC, Explore to join
            </Text>
            <Button
              onPress={() => {
                // setModals((prevState: any) => ({
                //   ...prevState,
                //   accountVerification: true,
                // }));
                navigation.navigate('ExploreScreen');
              }}
              width={'80%'}
              mt={verticalScale(5)}
              size={'md'}
              variant={'solid'}
              borderRadius={12}
              _pressed={{
                backgroundColor: 'DISABLED_COLOR',
              }}
              _text={{
                color: 'WHITE_COLOR',
                fontFamily: Fonts.POPPINS_MEDIUM,
              }}
              backgroundColor={'PRIMARY_COLOR'}>
              Explore Now
            </Button>
          </View>
          <View>
          <People/>
          </View>
        </View>
      )}
      {!activeLoad && activeBc.length > 0 && (
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              // marginBottom: verticalScale(35),
              padding: verticalScale(5),
            }}
            horizontal
            data={activeBc}
            keyExtractor={(item: any, index: number) => item.id}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.activeBcCntainer} key={index}>
                  <Text
                    color={'#06202E'}
                    isTruncated={true}
                    numberOfLines={1}
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                    fontSize={verticalScale(18)}>
                    {item.title}
                  </Text>
                  <Text
                    color={'#02A7FD'}
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                    fontSize={verticalScale(16)}
                    mt={2}>
                    {item.amount}{' '}
                    <Text
                      color={'#5A5A5C'}
                      fontFamily={Fonts.POPPINS_REGULAR}
                      fontSize={verticalScale(16)}>
                      / Month
                    </Text>
                  </Text>
                  <View
                    flexDirection={'row'}
                    alignItems="center"
                    mx={horizontalScale(12)}
                    mt={verticalScale(6)}>
                    <Avatar.Group
                      _avatar={{
                        size: 'sm',
                      }}
                      max={3}>
                      {[
                        '1494790108377-be9c29b29330',
                        '1603415526960-f7e0328c63b1',
                        '1607746882042-944635dfe10e',
                      ].map((item, index) => {
                        return (
                          <Avatar
                            key={index}
                            bg="green.500"
                            source={{
                              uri: `https://images.unsplash.com/photo-${item}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`,
                            }}>
                            AJ
                          </Avatar>
                        );
                      })}
                    </Avatar.Group>
                    <Text
                      color={'#5A5A5C'}
                      fontFamily={Fonts.POPPINS_MEDIUM}
                      ml={2}
                      fontSize={verticalScale(17)}>
                      {item.totalMembers}/{item.maxMembers}
                    </Text>
                  </View>
                  {/* <View
                  style={{
                    flex: 1,
                    // justifyContent: 'flex-end',
                    // alignItems: 'flex-end',
                    alignSelf: 'flex-end',
                    // backgroundColor: 'orange',
                  }}> */}
                  <Button
                    onPress={() => {
                      navigation.navigate('BcDetailsScreen', {
                        item: item.id,
                        deeplink: false,
                      });
                    }}
                    size="sm"
                    variant={'solid'}
                    _pressed={{
                      backgroundColor: 'DISABLED_COLOR',
                    }}
                    borderRadius={8}
                    _text={{
                      color: 'WHITE_COLOR',
                      fontFamily: Fonts.POPPINS_MEDIUM,
                    }}
                    backgroundColor={Colors.PRIMARY_COLOR}
                    style={{
                      alignSelf: 'flex-end',
                      // paddingHorizontal: 15,
                      // paddingVertical: 10,
                    }}>
                    Details
                  </Button>
                  {/* </View> */}
                </View>
              );
            }}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NewBc');
        }}
        style={{
          position: 'absolute',
          bottom: verticalScale(20),
          right: horizontalScale(20),
          zIndex: 1,
          elevation: 100,
        }}>
        <CreateBc />
      </TouchableOpacity>
      <Modal
        isOpen={firstSignup}
        // onClose={() => setFirstSignup(false)}
        safeAreaTop={true}
        backgroundColor={'rgba(0, 0, 0, 0.63)'}>
        <Modal.Content
          width={horizontalScale(325)}
          px={horizontalScale(30)}
          py={verticalScale(10)}>
          <Modal.Body>
            <View justifyContent={'center'} alignItems={'center'}>
              <Congratulations />
              <Text
                color={'#03110A'}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={'lg'}
                mt={2}>
                Congratulations
              </Text>
              <Text color={'GREY'} textAlign={'center'} mt={5}>
                Your account has been successfully created.
              </Text>
            </View>
          </Modal.Body>
          <Button
            backgroundColor={'PRIMARY_COLOR'}
            borderRadius={15}
            py={5}
            mb={3}
            _pressed={{
              backgroundColor: 'DISABLED_COLOR',
            }}
            onPress={() => {
              setFirstSignup(false);
            }}>
            Go To Home
          </Button>
        </Modal.Content>
      </Modal>
      {modals.commingSoon && (
        <InfoModal
          message="Your Safety Net! We're thrilled to announce that our upcoming
          app feature, Insurance, is coming soon!. Stay tuned for updates
          on this exciting new app feature!"
          buttonText="OK"
          callback={handleCallback}
         Photo={<CommimgSoonIcon />} 
          name={modalEnums.COMMING_SOON}
          isButtonPressed={isButtonPressed}
        />
      )}
      {modals.accountVerification && (
        <InfoModal
          message="your account is not currently verified with Jazzdost."
          buttonText="Verify Now"
          callback={handleCallback}
          Photo={<AccountNotVerified/>}
          name={modalEnums.ACCOUNT_NOT_VERIFIED}
          isButtonPressed={isButtonPressed}
        />
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  dot: {
    backgroundColor: 'rgba(0, 0, 0, 0.63)',
    width: 5,
    height: 5,
    borderRadius: 5,
    margin: 3,
    bottom: verticalScale(-35),
  },
  activeDot: {
    backgroundColor: Colors.PRIMARY_COLOR,
    width: 5,
    height: 5,
    borderRadius: 5,
    margin: 3,
    bottom: verticalScale(-35),
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBcCntainer: {
    width: horizontalScale(250),
    backgroundColor: 'white',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    borderRadius: 15,
    elevation: 2,
    marginRight: horizontalScale(10),
    minHeight: verticalScale(150),
  },
  Togglecontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedText: {
    backgroundColor: '#02A7FD',
    color: '#fff',
  },
  unSelectedText: {
    backgroundColor: '#F6F6F6',
    color: '#5A5A5C',
  },
});
