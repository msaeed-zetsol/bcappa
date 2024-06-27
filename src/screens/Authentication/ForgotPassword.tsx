import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, FormControl, Button} from 'native-base';
import React, {useState} from 'react';
import {newColorTheme} from '../../constants/Colors';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import {Pressable} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {Fonts, Images} from '../../constants';
import {useForm, Controller} from 'react-hook-form';
import TextFieldComponent from '../../components/TextFieldComponent';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation: any = useNavigation();
  const [isEmailSelected, setIsEmailSelected] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      phoneNumber: '',
    },
  });

  const forgotHandler = async (details: any) => {
    console.log({details});
    const data: any = {};
    if (isEmailSelected) {
      data.email = details.email;
    } else {
      data.phone = details.phoneNumber;
    }

    navigation.navigate('OtpAccountVerification', {
      data: data,
      show: true,
      from: 'forgot',
      hide: true,
    });
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <Images.BackButton
            wdith={horizontalScale(50)}
            height={verticalScale(50)}
          />
        </Pressable>
        <Text
          fontSize="xl"
          color="BLACK_COLOR"
          ml={'2'}
          textAlign={'center'}
          fontFamily={Fonts.POPPINS_SEMI_BOLD}>
          Forgot Password
        </Text>
      </View>

      <Text
        color="GREY"
        fontSize="sm"
        letterSpacing="0.32"
        mt={verticalScale(10)}
        fontFamily={Fonts.POPPINS_MEDIUM}>
        Please enter your email or phone number; we will send you an OTP.
      </Text>
      <View style={styles.Togglecontainer}>
        <TouchableOpacity
          onPress={() => {
            // reset
            reset({
              phoneNumber: '',
              email: '',
            });
            setIsEmailSelected(true);
          }}>
          <Text
            style={[
              styles.text,
              isEmailSelected ? styles.selectedText : styles.unSelectedText,
              {
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              },
            ]}>
            email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            reset({
              phoneNumber: '',
              email: '',
            });
            setIsEmailSelected(false);
          }}>
          <Text
            style={[
              styles.text,
              !isEmailSelected ? styles.selectedText : styles.unSelectedText,
              {
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              },
            ]}>
            phone
          </Text>
        </TouchableOpacity>
      </View>
      <FormControl mt={verticalScale(20)}>
        {isEmailSelected ? (
          <>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextFieldComponent
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
          </>
        ) : (
          <>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextFieldComponent
                  placeholder={'Phone Number'}
                  value={value}
                  // ref={phoneRef}
                  onBlur={onBlur}
                  onChange={onChange}
                  keyboardType={'number-pad'}
                />
              )}
              name="phoneNumber"
              rules={{
                required: 'Phone must be 11 numbers long',
                minLength: 11,
                maxLength: 11,
              }}
              defaultValue=""
            />
            {errors.phoneNumber && (
              <Text
                color={'ERROR'}
                marginTop={verticalScale(5)}
                fontFamily={Fonts.POPPINS_MEDIUM}>
                {/* Phone Number is required */}
                Phone must be 11 numbers long
              </Text>
            )}
          </>
        )}
      </FormControl>
      <Button
        isLoading={isLoading}
        // isLoadingText="Logging in"
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
        mt={verticalScale(20)}
        p={'4'}
        borderRadius={16}
        isPressed={isLoading}
        onPress={handleSubmit(forgotHandler)}>
        Send Otp
      </Button>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: newColorTheme.WHITE_COLOR,
    paddingHorizontal: horizontalScale(28),
    paddingVertical: verticalScale(30),
  },
  Togglecontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: verticalScale(15),
  },
  selectedText: {
    backgroundColor: '#02A7FD',
    color: '#fff',
  },
  unSelectedText: {
    backgroundColor: '#F6F6F6',
    color: '#5A5A5C',
  },
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
