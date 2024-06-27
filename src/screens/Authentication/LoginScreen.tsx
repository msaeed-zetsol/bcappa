import {StyleSheet, StatusBar, TouchableOpacity, Keyboard} from 'react-native';
import React, {useState} from 'react';
import {Images, Fonts} from '../../constants';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import {useForm, Controller} from 'react-hook-form';

import {
  Text,
  Box,
  Input,
  FormControl,
  Pressable,
  Icon,
  Button,
  View,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {newColorTheme} from '../../constants/Colors';
import {apimiddleWare} from '../../utilities/HelperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestUserPermission} from '../../firebase/Notifications';
import {useDispatch} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '425837288874-ivnre9s31uk6clo206fqaa8op0n5p5r3.apps.googleusercontent.com',
});

const LoginScreen = () => {
  const dispatch: any = useDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigation: any = useNavigation();
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // ------------------Login ---------------------//

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

  const logoutSocialLogIn = async () => {
    try {
      const data = await GoogleSignin.signOut();
      console.log({data});
      // Handle any additional logout steps for social login providers
    } catch (err) {
      console.log(err);
    }
  };

  const LoginHandler = async (details: any) => {
    try {
      const getToken: any = await AsyncStorage.getItem('fcmToken');
      const parsedFcmToken: any = await JSON.parse(getToken);
      Keyboard.dismiss();
      setIsLoading(true);

      const data = {
        email: details.email,
        password: details.password,
        fcmToken: parsedFcmToken,
      };

      const response = await apimiddleWare({
        url: '/auth/login',
        method: 'post',
        data: data,
        reduxDispatch: dispatch,
        navigation: navigation,
      });

      if (response) {
        const loginUserDataString = JSON.stringify(response);
        await AsyncStorage.setItem('loginUserData', loginUserDataString);
        await requestUserPermission();
        navigation.replace('BottomNavigator', {
          screen: 'HomeScreen',
          params: {
            screenName: 'Login',
          },
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={newColorTheme.WHITE_COLOR}
        barStyle={'dark-content'}
      />
      <Text
        fontSize="3xl"
        color="BLACK_COLOR"
        mt="10"
        fontFamily={Fonts.POPPINS_SEMI_BOLD}>
        Welcome Back!
      </Text>
      <Text
        color="GREY"
        fontSize="md"
        letterSpacing="0.32"
        mt={verticalScale(5)}
        fontFamily={Fonts.POPPINS_MEDIUM}>
        Please sign in to continue.
      </Text>
      <Box mt={verticalScale(40)}>
        <FormControl w="100%">
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <View>
                <Input
                  placeholder="Email"
                  w="100%"
                  size="lg"
                  borderRadius={16}
                  p="3"
                  pl="5"
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
                  inputMode="email"
                />
              </View>
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
        </FormControl>
        <FormControl w="100%">
          <Controller
            control={control}
            rules={{
              required: 'Password is required',
              minLength: 8,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Password"
                w="100%"
                size="lg"
                borderRadius={16}
                p="3"
                pl="5"
                mt={verticalScale(25)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                type={show ? 'text' : 'password'}
                borderColor="BORDER_COLOR"
                placeholderTextColor={'GREY'}
                color={'BLACK_COLOR'}
                fontSize={'sm'}
                fontFamily={Fonts.POPPINS_REGULAR}
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
          />
          {errors.password && (
            <Text
              color={'ERROR'}
              marginTop={verticalScale(5)}
              fontFamily={Fonts.POPPINS_MEDIUM}>
              Password length must be greater than 8
            </Text>
          )}
        </FormControl>
      </Box>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Forgot');
        }}>
        <Text
          color="PRIMARY_COLOR"
          fontSize="sm"
          fontFamily={Fonts.POPPINS_REGULAR}
          letterSpacing="0.32"
          alignSelf="flex-end"
          mt={verticalScale(15)}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

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
        mt={verticalScale(50)}
        p={'4'}
        borderRadius={16}
        // isDisabled={isLoading}
        isPressed={isLoading}
        onPress={handleSubmit(LoginHandler)}>
        Sign In
      </Button>
      <View width={'100%'} justifyContent={'center'} mt={verticalScale(20)}>
        <View borderWidth={0.5} borderColor={'BORDER_COLOR'} />
        <View position={'absolute'} flexWrap={'wrap'} alignSelf="center">
          <Text
            textAlign={'center'}
            bg={'WHITE_COLOR'}
            color="GREY"
            width="100%"
            alignSelf="center"
            px="3">
            OR
          </Text>
        </View>
      </View>
      <View
        width={'100%'}
        height={verticalScale(100)}
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
          <Images.Google />
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
          onPress={logoutSocialLogIn}
          _pressed={{
            backgroundColor: 'DISABLED_COLOR',
          }}>
          <Images.Facebook />
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
          Don't have an account?
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignupScreen');
          }}>
          <Text
            color={'PRIMARY_COLOR'}
            letterSpacing={0.3}
            fontFamily={Fonts.POPPINS_MEDIUM}
            ml={1}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

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
    borderRadius: 16,
    width: '48%',
    justifyContent: 'center',
  },
});
