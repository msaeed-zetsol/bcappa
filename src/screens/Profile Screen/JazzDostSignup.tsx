import {StatusBar} from 'react-native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Box,
  FormControl,
  Icon,
  Pressable,
  Select,
  Button,
} from 'native-base';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Heading from '../../components/Heading';
import Colors, {newColorTheme} from '../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {Fonts} from '../../constants';
import {useForm, Controller} from 'react-hook-form';
import {CountryPicker} from 'react-native-country-codes-picker';
import DatePicker from 'react-native-date-picker';
import TextFieldComponent from '../../components/TextFieldComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const JazzDostSignup = () => {
  const navigation: any = useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState('+92');
  const [date, setDate] = useState<any>(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [showDate, setShowDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      phoneNumber: '',
      cnicNumber: '',
      carrier: '',
    },
  });
  const signupHandler = (details: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // console.log(data);
    // setIsLoading(true);
    // if (data) {
    //   setTimeout(() => {
    //     setIsLoading(false);
    //     navigation.navigate('OtpAccountVerification', {
    //       phoneNumber: data.phoneNumber,
    //     });
    //   }, 3000);
    // }
  };
  return (
    <View
      flex={1}
      bg={'BACKGROUND_COLOR'}
      pt={verticalScale(15)}
      px={horizontalScale(20)}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <Heading navigation={navigation} />
      <View mt={verticalScale(40)}>
        <Text fontSize={verticalScale(22)} fontFamily={Fonts.POPPINS_BOLD}>
          Welcome To Dost
        </Text>
        <Text color={Colors.GREY} fontFamily={Fonts.POPPINS_REGULAR}>
          Create a new bank account
        </Text>
      </View>
      <DatePicker
        modal
        mode="date"
        open={openDate}
        maximumDate={new Date()}
        date={new Date(date)}
        locale="en"
        theme="dark"
        onConfirm={selectedDate => {
          setDate(selectedDate);
          setShowDate(selectedDate.toLocaleDateString());
          setOpenDate(false);

          // console.log(selectedDate);
        }}
        onCancel={() => {
          setOpenDate(false);
        }}
      />
      {/*  */}
      <Box mt={verticalScale(20)}>
        {/* email */}
        <FormControl mt={verticalScale(15)}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextFieldComponent
                placeholder={'Enter your CNIC'}
                // width="48%"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                keyboardType={'number-pad'}
              />
            )}
            name="cnicNumber"
            rules={{
              required: 'CNIC is required',
              minLength: 13,
            }}
            defaultValue=""
          />
          {errors.cnicNumber && (
            <Text
              color={'ERROR'}
              marginTop={verticalScale(5)}
              fontFamily={Fonts.POPPINS_MEDIUM}>
              CNIC is required
            </Text>
          )}
          <View mt={verticalScale(15)}>
            <TextFieldComponent
              placeholder={'Date of Birth'}
              value={showDate}
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

            {/* {!showDate && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Date of Birth is required
                </Text>
              )} */}
          </View>
          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextFieldComponent
                  placeholder={'Phone Number'}
                  value={value}
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
                      <Text fontSize={'sm'} fontFamily={Fonts.POPPINS_REGULAR}>
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
                required: 'Phone Number is required',
                minLength: 9,
              }}
              defaultValue=""
            />
            {errors.phoneNumber && (
              <Text
                color={'ERROR'}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}>
                Phone Number is required
              </Text>
            )}
          </View>
          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Service"
                  placeholder="Carrier"
                  borderRadius={16}
                  borderColor="BORDER_COLOR"
                  p="3"
                  fontSize={'sm'}
                  placeholderTextColor={'GREY'}
                  size="lg"
                  selectedValue={value}
                  onValueChange={newValue => onChange(newValue)}
                  color={'BLACK_COLOR'}>
                  <Select.Item label="Jazz" value="jazz" />
                  <Select.Item label="Ufone" value="ufone" />
                  <Select.Item label="Telenor" value="telenor" />
                  <Select.Item label="Zong" value="zong" />
                  {/* <Select.Item label="Backend Development" value="backend" /> */}
                </Select>
              )}
              name="carrier"
              rules={{
                required: 'Carrier is required',
                //   minLength: 6,
              }}
              defaultValue=""
            />
            {errors.carrier && (
              <Text
                color={'ERROR'}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}>
                Carrier is required
              </Text>
            )}
          </View>
        </FormControl>
        <Button
          isLoading={isLoading}
          // isLoadingText="Signing up"
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
          Create Account
        </Button>
      </Box>
      {/*  */}
    </View>
  );
};

export default JazzDostSignup;
