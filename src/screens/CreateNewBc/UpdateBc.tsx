import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Platform,
  Easing,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  View,
  FormControl,
  Input,
  Box,
  Modal,
  Button,
  Avatar,
  Pressable,
  Icon,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Colors, {newColorTheme} from '../../constants/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {Fonts, Images} from '../../constants';
import ToggleSwitch from 'toggle-switch-react-native';
import Heading from '../../components/Heading';
import SortableList from 'react-native-sortable-list';
import {apimiddleWare} from '../../utilities/HelperFunctions';
import {BcSelectionType, BcStatus, BcType} from '../../lookups/Enums';
import {useDispatch, useSelector} from 'react-redux';
// import DatePicker from 'react-native-date-picker';
import TextFieldComponent from '../../components/TextFieldComponent';
import {
  addMember,
  removeMember,
  setMembers,
  updateMembersOrder,
} from '../../redux/members/membersSlice';
import {RootState} from '../../redux/store';
import {removeMembers} from '../../redux/user/userSlice';

const UpdateBc = () => {
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();
  const route: any = useRoute();
  const {item} = route.params;
  const [bcData, setBcData] = useState<any>();
  const [disabled, setIsDisabled] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [date, setDate] = useState<any>(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState('');
  const [load, setLoad] = useState(true);
  const members = useSelector((state: any) => state.members);
  const remove: any = useSelector((state: RootState) => state.users.removeUser);

  const [totalExpected, setTotalExpected] = useState(0);
  const [balloting, setBalloting] = useState(
    item.selectionType === BcSelectionType.Auto,
  );

  const calculateTotalExpected = () => {
    return item.amount * item.maxMembers;
  };
  useEffect(() => {
    return setTotalExpected(calculateTotalExpected());
  }, []);

  let currentDate = new Date();
  let nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);

  const getData = async () => {
    setLoad(true);
    const response = await apimiddleWare({
      url: `/bcs/details/${item.id}`,
      method: 'get',
    });
    if (response) {
      console.log({sayen: response[0].bcMembers});
      setBcData(response[0]);
      response[0].bcMembers.sort(
        (a: any, b: any) => a.openingPrecedence - b.openingPrecedence,
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

      dispatch(updateMembersOrder(mem));
      setLoad(false);
      const d = response[0].commenceDate.split('T')[0];
      setShowDate(d);
      setBalloting(bcData.selectionType === BcSelectionType.Auto);
    }
    setLoad(false);
  };
  const {
    control: newBcControl,
    handleSubmit: handleNewBcSubmit,
    formState: {errors: newBcError},
  } = useForm({
    defaultValues: {
      title: String(item.title),
      totalUsers: String(item.maxMembers),
      amountPerMonth: String(item.amount),
    },
  });

  const {
    control: addMembersControl,
    handleSubmit: handleAddMembersSubmit,
    formState: {errors: addMemberError},
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      openingPrecedence: 0,
    },
  });

  const handleDialPress = () => {
    const phoneNumberURL = 'tel:03163110456';
    Linking.openURL(phoneNumberURL).catch(error => {
      console.error(`Failed to open the phone dialer: ${error}`);
    });
  };

  const deleteMembers = async () => {
    console.log({membersstart: members});
    const data = {
      bcId: item.id,
      membersId: remove,
    };
    const response = await apimiddleWare({
      url: '/bcs/private/remove-members',
      method: 'delete',
      data: data,
      reduxDispatch: dispatch,
    });
    console.log({data});
    if (response) {
      console.log({saye: response});
    }
  };
  const updateBc = async (details: any) => {
    console.group({remove});
    if (remove.length > 0) {
      await deleteMembers();
    }

    console.log({members});
    const a = members.map((item: any, index: any) => {
      item.openingPrecedence = index + 1;
    });
    const finalMembers = members.map((item: any) => {
      return {
        fullName: item?.fullName,
        email: item?.email,
        phone: item?.phone,
        openingPrecedence: item?.openingPrecedence,
      };
    });
    console.log({members: finalMembers});
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
    console.log({data_sayen: data});
    const response = await apimiddleWare({
      url: `/bcs/${item.id}`,
      method: 'put',
      data: data,
      reduxDispatch: dispatch,
      navigation,
    });
    if (response) {
      console.log({response});
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
    <View flex={1} bg={'BACKGROUND_COLOR'} px={horizontalScale(20)}>
      <StatusBar backgroundColor={newColorTheme.BACKGROUND_COLOR} />
      <Heading
        name={'Update Bc'}
        navigation={navigation}
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
              render={({field: {onChange, onBlur, value}}) => (
                <View>
                  <Input
                    placeholder="Title"
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
                    placeholderTextColor={'GREY'}
                    color={'BLACK_COLOR'}
                    fontFamily={Fonts.POPPINS_REGULAR}
                    fontSize={'sm'}
                    inputMode="text"
                  />
                </View>
              )}
              name="title"
              rules={{
                required: 'Title is required',
              }}
              defaultValue=""
            />
            {newBcError.title && (
              <Text
                color={'ERROR'}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}>
                Title is required
              </Text>
            )}
            <View mt={verticalScale(15)}>
              <Controller
                control={newBcControl}
                render={({field: {onChange, onBlur, value}}) => (
                  <View>
                    <Input
                      placeholder="Max Users"
                      w="100%"
                      size="lg"
                      borderRadius={16}
                      p="3"
                      pl="6"
                      autoCapitalize="none"
                      keyboardType="number-pad"
                      autoCorrect={false}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      borderColor="BORDER_COLOR"
                      placeholderTextColor={'GREY'}
                      color={'BLACK_COLOR'}
                      fontFamily={Fonts.POPPINS_REGULAR}
                      fontSize={'sm'}
                    />
                  </View>
                )}
                name="totalUsers"
                rules={{
                  required: 'Max Users are required',
                }}
                defaultValue=""
              />
              {newBcError.totalUsers && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Max user are required
                </Text>
              )}
            </View>
            <View mt={verticalScale(15)}>
              <Controller
                control={newBcControl}
                render={({field: {onChange, onBlur, value}}) => (
                  <View>
                    <Input
                      placeholder="Amount/Month"
                      w="100%"
                      size="lg"
                      borderRadius={16}
                      p="3"
                      pl="6"
                      autoCapitalize="none"
                      keyboardType="number-pad"
                      autoCorrect={false}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      borderColor="BORDER_COLOR"
                      placeholderTextColor={'GREY'}
                      color={'BLACK_COLOR'}
                      fontFamily={Fonts.POPPINS_REGULAR}
                      fontSize={'sm'}
                    />
                  </View>
                )}
                name="amountPerMonth"
                rules={{
                  required: 'Amount Per Month is required',
                }}
                defaultValue=""
              />
              {newBcError.amountPerMonth && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Amount Per Month is required
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setOpenDate(true)}
              style={{marginTop: verticalScale(15)}}>
              <TextFieldComponent
                placeholder={'Date of Birth'}
                value={showDate}
                readOnly={true}
                InputRightElement={
                  <Pressable onPress={() => setOpenDate(true)}>
                    <Icon
                      as={<Ionicons name={'calendar'} />}
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
              fontSize={'sm'}
              color={'GREY'}>
              Total expected amount per BC {totalExpected}
              <Text
                color={'PRIMARY_COLOR'}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}>
                100000
              </Text>
            </Text>
          </FormControl>
          <View
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mt={verticalScale(35)}>
            <Text fontFamily={Fonts.POPPINS_SEMI_BOLD} fontSize={'lg'}>
              BC Balloting
            </Text>
            <View>
              <ToggleSwitch
                isOn={balloting}
                onColor={Colors.PRIMARY_COLOR}
                offColor={Colors.GREY}
                label={balloting ? 'Auto' : 'Manual'}
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
              mode={'date'}
              display="default"
              minimumDate={nextDay}
              onChange={(txt: any) => {
                console.log('bhai');
                setOpenDate(false);
                const data = new Date(txt.nativeEvent.timestamp);
                setDate(data);
                setShowDate(data.toLocaleDateString());
              }}
              style={{flex: 1, backgroundColor: 'red'}}
              positiveButton={{
                label: 'OK',
                textColor: Colors.PRIMARY_COLOR,
              }}
              negativeButton={{
                label: 'Cancel',
                textColor: Colors.PRIMARY_COLOR,
              }}
            />
          )}
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mt={verticalScale(30)}>
            <Text fontFamily={Fonts.POPPINS_SEMI_BOLD} fontSize={'lg'}>
              Members
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => {
              navigation.navigate('AddMembers', {
                balloting: balloting,
              });
            }}>
            <Images.AddUser />
            <Text
              color={Colors.PRIMARY_COLOR}
              ml={horizontalScale(5)}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              View Members {`(${members.length})`}
            </Text>
          </TouchableOpacity>

          <View justifyContent={'flex-end'} mb={verticalScale(10)}>
            <Text
              color={Colors.BLACK_COLOR}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}
              my={verticalScale(5)}
              fontSize={'md'}>
              Don’t know ho to add?
            </Text>
            <TouchableOpacity
              onPress={handleDialPress}
              style={[
                styles.btnContainer,
                {
                  borderColor: Colors.PRIMARY_COLOR,
                  borderWidth: 2,
                  backgroundColor: 'white',
                },
              ]}>
              <Images.Call />
              <Text
                color={Colors.PRIMARY_COLOR}
                ml={horizontalScale(5)}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}>
                Call Our Helpline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNewBcSubmit(updateBc)}
              // onPress={() => deleteMembers()}
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
              ]}>
              <Text
                color={Colors.WHITE_COLOR}
                ml={horizontalScale(5)}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} color={Colors.PRIMARY_COLOR} />
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
    backgroundColor: '#F0FAFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: verticalScale(15),
    borderRadius: 15,
    marginVertical: verticalScale(10),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },
  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: '#999999',
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: horizontalScale(10),
  },
  row: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: horizontalScale(2),
    // height: 100,
    flex: 1,
    marginVertical: verticalScale(10),

    borderRadius: 10,
    ...Platform.select({
      ios: {
        // width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
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
    color: '#222222',
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
