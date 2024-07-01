import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Fonts} from '../../constants';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import {CountryPicker} from 'react-native-country-codes-picker';
import {useForm, Controller} from 'react-hook-form';

import {
  Text,
  Box,
  FormControl,
  Pressable,
  Icon,
  Button,
  View,
  Select,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors, {newColorTheme} from '../../constants/Colors';

import {useNavigation} from '@react-navigation/native';
import TextFieldComponent from '../../components/TextFieldComponent';
import {apimiddleWare} from '../../utilities/HelperFunctions';
import CheckBox from '@react-native-community/checkbox';
import {useDispatch} from 'react-redux';
// import {Calendar, LocaleConfig} from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import {locationPermission} from '../../service/LocationService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../assets/svg/BackButton';
import GoogleIcon from '../../assets/svg/GoogleIcon';
import Facebook from '../../assets/svg/Facebook';

const initialDate = new Date();
initialDate.setDate(initialDate.getDate() - 1); // Set initial date to one day before today

const SignupScreen = () => {
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState('+92');
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState('');
  const navigation: any = useNavigation();
  const [toggleCheckBox, setToggleCheckBox] = useState<any>(false);
  const dispatch: any = useDispatch();
  const fullNameRef: any = useRef();
  const emailRef: any = useRef();
  const cnicRef: any = useRef();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      cnicNumber: '',
      password: '',
      gender: '',
    },
  });

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {user} = await GoogleSignin.signIn();
      const getToken: any = await AsyncStorage.getItem('fcmToken');
      const parsedFcmToken: any = await JSON.parse(getToken);

      const datas = {
        ...user,
        fcmToken: parsedFcmToken,
        role: 'customer',
      };

      const response = await apimiddleWare({
        url: '/auth/login/google',
        method: 'post',
        data: datas,
      });

      if (response) {
        const loginUserDataString = JSON.stringify(response);
        await AsyncStorage.setItem('loginUserData', loginUserDataString);
        navigation.replace('BottomNavigator', {
          screen: 'HomeScreen',
          params: {
            screenName: 'Login',
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signupHandler = async (details: any) => {
    setIsLoading(true);

    const getCred = await verifyCred(details);
    setIsLoading(false);

    if (showDate && toggleCheckBox && getCred.message === 'Success') {
      if (!details.gender) {
        // Use the error message for gender validation from the useForm hook
        console.log(errors.gender); // Log the error object for reference
        return;
      }

      const data = {
        fullName: details.fullName,
        email: details.email,
        phone: countryCode + details.phoneNumber,
        cnic: details.cnicNumber,
        dob: date,
        gender: details.gender,
        password: details.password,
        role: 'customer',
      };

      navigation.navigate('OtpAccountVerification', {
        data: data,
        show: true,
        from: 'Signup',
        hide: false,
      });
    } else {
      if (!showDate) {
        Alert.alert('Please enter your date of birth');
      } else if (!toggleCheckBox) {
        Alert.alert('Please read Terms and Conditions and Privacy Policy');
      }
    }
  };
  const verifyCred = async (details: any) => {
    const data = {
      email: details.email,
      phone: countryCode + details.phoneNumber,
      cnic: details.cnicNumber,
    };

    const response = await apimiddleWare({
      url: '/auth/verifyCredentials',
      method: 'post',
      data: data,
      reduxDispatch: dispatch,
      navigation,
    });

    if (response) {
      return response;
    }
  };

  useEffect(() => {
    locationPermission();
    return () => {
      reset({
        fullName: '',
        email: '',
        phoneNumber: '',
        cnicNumber: '',
        password: '',
      });
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={newColorTheme.WHITE_COLOR}
        barStyle={'dark-content'}
      />

      {/* country */}
      <Modal visible={showDropdown} transparent={true} animationType="slide">
        <CountryPicker
          lang={'en'}
          show={showDropdown}
          // when picker button press you will get the country object with dial code
          pickerButtonOnPress={(item: any) => {
            setCountryCode(item.dial_code);
            setShowDropdown(false);
          }}
          style={{
            // Styles for whole modal [View]
            modal: {
              maxHeight: '75%',
            },
          }}
          onBackdropPress={() => {
            setShowDropdown(false);
          }}
        />
      </Modal>

      {openDate && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode={'date'}
          display="default"
          maximumDate={new Date(new Date().setDate(new Date().getDate() - 1))}
          onChange={(event: any, selectedDate?: Date) => {
            setOpenDate(false);
            if (selectedDate) {
              setDate(selectedDate);
              setShowDate(selectedDate.toLocaleDateString());
            }
          }}
          onTouchCancel={() => {
            setOpenDate(false);
          }}
          style={{flex: 1, backgroundColor: 'red'}}
          positiveButton={{label: 'OK', textColor: Colors.PRIMARY_COLOR}}
          negativeButton={{label: 'Cancel', textColor: Colors.PRIMARY_COLOR}}
        />
      )}

      {/*  */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <BackButton
          />
        </Pressable>
        <Text
          fontSize="2xl"
          color="BLACK_COLOR"
          ml="5"
          fontFamily={Fonts.POPPINS_SEMI_BOLD}>
          Sign Up
        </Text>
      </View>
      <Text
        color="GREY"
        fontSize="md"
        letterSpacing="0.32"
        mt={verticalScale(13)}
        fontFamily={Fonts.POPPINS_MEDIUM}>
        It only takes a minute to create your account
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box mt={verticalScale(20)}>
          {/* email */}
          <FormControl mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextFieldComponent
                  placeholder={'Full Name (As Per CNIC) '}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  keyboardType={'ascii-capable'}
                  ref={fullNameRef as any}
                  onSubmitEditing={() => {
                    console.log(emailRef);
                    emailRef?.current?.focus();
                  }}
                  // ref={nameRef}
                />
              )}
              name="fullName"
              rules={{
                required: 'fullName is required',
              }}
              defaultValue=""
            />
            {errors.fullName && (
              <Text
                color={'ERROR'}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}>
                First name is required
              </Text>
            )}

            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextFieldComponent
                    ref={emailRef}
                    placeholder={'Email'}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    keyboardType={'email-address'}
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
              {errors.email && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextFieldComponent
                    placeholder={'3XZYYYYYYY'}
                    value={value}
                    // ref={phoneRef}
                    onBlur={onBlur}
                    onChange={onChange}
                    keyboardType={'number-pad'}
                    InputLeftElement={
                      <Pressable
                        onPress={() => setShowDropdown(true)}
                        flexDirection={'row'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        ml="6">
                        <Text
                          fontSize={'sm'}
                          fontFamily={Fonts.POPPINS_REGULAR}>
                          {countryCode}
                        </Text>
                        <Icon
                          as={<Ionicons name={'caret-down'} />}
                          size={5}
                          ml="2"
                          color="BLACK_COLOR"
                        />
                        <View
                          borderWidth={0.5}
                          borderColor={'BORDER_COLOR'}
                          height={5}
                          ml={2}
                        />
                      </Pressable>
                    }
                  />
                )}
                name="phoneNumber"
                rules={{
                  required: 'PhoneNumber is required',
                  // minLength: 7,
                  // maxLength: 15,
                }}
                defaultValue=""
              />
              {errors.phoneNumber && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Invalid Phone Number length
                </Text>
              )}
            </View>

            {/*  nic*/}
            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextFieldComponent
                    placeholder={'Cnic No'}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={cnicRef}
                    keyboardType={'number-pad'}
                  />
                )}
                name="cnicNumber"
                rules={{
                  required: 'Cnic is required',
                  minLength: 13,
                  maxLength: 13,
                }}
                defaultValue=""
              />
              {errors.cnicNumber && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Cnic must be 13 numbers long
                </Text>
              )}
            </View>
            <View mt={verticalScale(15)}>
              <FormControl borderRadius={16} isReadOnly>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <Select
                      padding={3}
                      selectedValue={value}
                      borderRadius={16}
                      placeholderTextColor={'GREY'}
                      color={'BLACK_COLOR'}
                      fontSize={'sm'}
                      fontFamily={Fonts.POPPINS_REGULAR}
                      accessibilityLabel="Select Gender"
                      dropdownIcon={<Icon as={''} name="caret-down" />}
                      placeholder="Select Gender"
                      onValueChange={itemValue => onChange(itemValue)}>
                      <Select.Item label="Male" value="male" />
                      <Select.Item label="Female" value="female" />
                      <Select.Item label="Other" value="other" />
                    </Select>
                  )}
                  name="gender"
                  rules={{required: 'Gender is required'}} // Add required validation rule
                />
              </FormControl>
              {errors.gender && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  {errors.gender.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setOpenDate(true)}
              style={{marginTop: verticalScale(15)}}>
              <TextFieldComponent
                placeholder={'Date of Birth (As Per CNIC)'}
                value={showDate}
                readOnly={true}
                // onBlur={onBlur}
                // onChange={onChange}
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
            <View mt={verticalScale(15)}>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextFieldComponent
                    placeholder={'Password'}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    type={show ? 'text' : 'password'}
                    InputRightElement={
                      <Pressable onPress={() => setShow(!show)}>
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? 'visibility' : 'visibility-off'}
                            />
                          }
                          size={5}
                          mr="5"
                          color="muted.400"
                        />
                      </Pressable>
                    }
                  />
                )}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: 8,
                }}
                defaultValue=""
              />
              {errors.password && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Password must be greater than 8
                </Text>
              )}
            </View>
          </FormControl>
        </Box>
        <View mt={3} flexDirection={'row'} alignItems={'center'} flex={1}>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={newValue => setToggleCheckBox(newValue)}
            tintColors={{true: Colors.PRIMARY_COLOR, false: Colors.GREY}}
          />
          <View
            flexDirection={'row'}
            flexWrap={'wrap'}
            flex={1}
            alignItems={'center'}
            ml={1}>
            <Text>I agree the BC Appa</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndConditions', {
                  name: 'Terms And Condition',
                });
              }}>
              <Text color={'PRIMARY_COLOR'}> Terms of Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndConditions', {
                  name: 'Privacy Policy',
                });
              }}>
              <Text color={'PRIMARY_COLOR'}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          isLoading={isLoading}
          variant="solid"
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
          spinnerPlacement="end"
          backgroundColor={'PRIMARY_COLOR'}
          size={'lg'}
          mt={verticalScale(50)}
          p={'4'}
          borderRadius={16}
          isPressed={isLoading}
          onPress={handleSubmit(signupHandler)}>
          Sign Up
        </Button>
        <View width={'100%'} justifyContent={'center'} mt={verticalScale(25)}>
          <View borderWidth={0.5} borderColor={'BORDER_COLOR'} />
          <View position={'absolute'} flexWrap={'wrap'} alignSelf="center">
            <Text
              textAlign={'center'}
              bg={'WHITE_COLOR'}
              color="GREY"
              width="100%"
              alignSelf="center"
              px="3"
              fontFamily={Fonts.POPPINS_REGULAR}>
              Or Continue with
            </Text>
          </View>
        </View>
        <View
          width={'100%'}
          height={100}
          mt={verticalScale(10)}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <Pressable
            style={styles.socialButton}
            onPress={googleLogin}
            _pressed={{
              backgroundColor: 'DISABLED_COLOR',
            }}>
            <GoogleIcon />
            <Text
              pl="2"
              fontSize={verticalScale(16)}
              textAlign={'center'}
              fontFamily={Fonts.POPPINS_MEDIUM}>
              Google
            </Text>
          </Pressable>
          <Pressable
            style={styles.socialButton}
            _pressed={{
              backgroundColor: 'DISABLED_COLOR',
            }}>
            <Facebook />
            <Text
              pl="2"
              fontSize={verticalScale(16)}
              fontFamily={Fonts.POPPINS_MEDIUM}>
              Facebook
            </Text>
          </Pressable>
        </View>
        <View
          alignItems={'center'}
          justifyContent={'center'}
          height={verticalScale(50)}
          flexDirection={'row'}
          alignSelf={'center'}>
          <Text
            color={'#5A5A5C'}
            letterSpacing={0.3}
            fontFamily={Fonts.POPPINS_MEDIUM}>
            Already Registered?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text
              color={'PRIMARY_COLOR'}
              letterSpacing={0.3}
              fontFamily={Fonts.POPPINS_MEDIUM}
              ml={1}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: newColorTheme.WHITE_COLOR,
    paddingHorizontal: horizontalScale(28),
    paddingVertical: verticalScale(30),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 12,
    width: '48%',
    justifyContent: 'center',
  },
});
