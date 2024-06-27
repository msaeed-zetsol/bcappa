import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  View,
  FormControl,
  Input,
  Box,
  Pressable,
  Icon,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Colors, {newColorTheme} from '../../constants/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {Fonts, Images} from '../../constants';
import ToggleSwitch from 'toggle-switch-react-native';
import Heading from '../../components/Heading';
import {apimiddleWare} from '../../utilities/HelperFunctions';
import {BcSelectionType, BcStatus, BcType} from '../../lookups/Enums';
import {useDispatch, useSelector} from 'react-redux';
import TextFieldComponent from '../../components/TextFieldComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import {setMembers} from '../../redux/members/membersSlice';
import {errors} from '../../redux/user/userSlice';

const NewBc = () => {
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();
  const members = useSelector((state: any) => state.members);
  const [disabled, setIsDisabled] = useState(false);
  const [balloting, setBalloting] = useState(false);
  const [maxUsers, setMaxUsers] = useState('');
  const [amountPerMonth, setAmountPerMonth] = useState('');
  const [bcTotal, setBcTotal] = useState(0);
  let currentDate = new Date();
  let nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);
  useEffect(() => {
    calculateTotal();
  }, [maxUsers, amountPerMonth]);

  const calculateTotal = () => {
    const total = +maxUsers * +amountPerMonth;
    setBcTotal(total);
  };

  const [date, setDate] = useState<any>(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState('');
  const {
    control: newBcControl,
    handleSubmit: handleNewBcSubmit,
    formState: {errors: newBcError},
  } = useForm({
    defaultValues: {
      title: '',
      totalUsers: '',
      amountPerMonth: '',
    },
  });

  const createBc = async (details: any) => {
    if (showDate) {
      setIsDisabled(true);
      if (members.length >= 1) {
        console.log(
          ' ---------------- members before delete ---------------- ',
        );
        console.log(members);

        if (balloting) {
          members.map((item: any, index: any) => {
            delete item.openingPrecedence;
          });
        }

        console.log(' ---------------- members after delete ---------------- ');
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

          console.log({sayen: data.bcMembers});
          const response = await apimiddleWare({
            url: '/bcs',
            method: 'post',
            data: data,
            reduxDispatch: dispatch,
            navigation,
          });
          if (response) {
            console.log({response});
            setIsDisabled(false);

            dispatch(setMembers([]));
            navigation.goBack();
          }
          setIsDisabled(false);
        } else {
          Alert.alert('Members can not be more than max members');
          setIsDisabled(false);
        }
      } else {
        Alert.alert('Please Add Members');
        setIsDisabled(false);
      }
    } else {
      dispatch(errors({message: 'Commence date is required', value: true}));
    }
  };

  const handleDialPress = () => {
    const phoneNumberURL = `tel:03163110456`;
    Linking.openURL(phoneNumberURL).catch(error => {
      console.error(`Failed to open the phone dialer: ${error}`);
    });
  };

  return (
    <View flex={1} bg={'BACKGROUND_COLOR'} px={horizontalScale(20)}>
      <StatusBar backgroundColor={newColorTheme.BACKGROUND_COLOR} />
      <Heading
        name={'Create New BC'}
        navigation={navigation}
        onPress={() => {
          dispatch(setMembers([]));
          navigation.goBack();
        }}
      />
      <Box mt={verticalScale(40)}></Box>
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
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
                    onChangeText={text => {
                      setMaxUsers(text);
                      onChange(text);
                    }}
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
                    onChangeText={text => {
                      setAmountPerMonth(text);
                      onChange(text);
                    }}
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
              placeholder={'Commence Date'}
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
            Total expected amount per BC{' '}
            <Text color={'PRIMARY_COLOR'} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              {bcTotal}
            </Text>
          </Text>
        </FormControl>
        {/*  */}
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
            mode={'date'}
            display="default"
            minimumDate={new Date()}
            onChange={(txt: any) => {
              setOpenDate(false);
              const data = new Date(txt.nativeEvent.timestamp);
              setDate(data);
              setShowDate(data.toLocaleDateString());
            }}
            style={{flex: 1, backgroundColor: 'red'}}
            positiveButton={{label: 'OK', textColor: Colors.PRIMARY_COLOR}}
            negativeButton={{label: 'Cancel', textColor: Colors.PRIMARY_COLOR}}
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
              members,
              maxUsers,
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

        {/*  */}
        <View justifyContent={'flex-end'} mb={verticalScale(10)}>
          <Text
            color={Colors.BLACK_COLOR}
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            my={verticalScale(5)}
            fontSize={'md'}>
            Don’t know how to add?
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
            onPress={handleNewBcSubmit(createBc)}
            disabled={disabled}
            style={[
              styles.btnContainer,
              {
                backgroundColor: disabled ? Colors.GREY : Colors.PRIMARY_COLOR,
                borderColor: disabled ? Colors.GREY : Colors.PRIMARY_COLOR,
                borderWidth: 2,
                marginTop: verticalScale(10),
              },
            ]}>
            <Text
              color={Colors.WHITE_COLOR}
              ml={horizontalScale(5)}
              fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              Create
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
