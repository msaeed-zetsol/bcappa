import {StyleSheet, StatusBar, Modal, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {View, Text, Pressable, Icon, Button} from 'native-base';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Colors, {newColorTheme} from '../../constants/Colors';
import Heading from '../../components/Heading';
import {useNavigation} from '@react-navigation/native';
import {Fonts, Images} from '../../constants';
import TextFieldComponent from '../../components/TextFieldComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CountryPicker} from 'react-native-country-codes-picker';

const JazzDostVerificationScreen = () => {
  const navigation: any = useNavigation();
  const [countryCode, setCountryCode] = useState('+92');
  const [showDropdown, setShowDropdown] = useState(false);
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dostLoading, setDostLoading] = useState(false);

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
      <Heading name={'JazzDost Verification'} navigation={navigation} />
      <View flexDirection={'row'} alignItems={'center'} mt={verticalScale(30)}>
        <Text
          color={Colors.GREY}
          fontFamily={Fonts.POPPINS_MEDIUM}
          mr={1}
          fontSize={verticalScale(15)}
          letterSpacing={0.5}>
          Verify your
        </Text>
        <Images.JazzDostIcon width={60} />
        <Text
          color={Colors.GREY}
          fontFamily={Fonts.POPPINS_MEDIUM}
          ml={1}
          fontSize={verticalScale(15)}
          letterSpacing={0.5}>
          Account With{' '}
        </Text>
      </View>
      <Text
        color={Colors.PRIMARY_COLOR}
        fontFamily={Fonts.POPPINS_SEMI_BOLD}
        ml={1}
        fontSize={verticalScale(16)}
        letterSpacing={0.5}>
        BC APPA
      </Text>
      <View mt={verticalScale(20)} />
      <TextFieldComponent
        placeholder={'Phone Number'}
        value={number}
        // onBlur={onBlur}
        onChange={num => {
          setNumber(num);
        }}
        keyboardType={'number-pad'}
        InputLeftElement={
          <Pressable
            onPress={() => setShowDropdown(true)}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            ml="3">
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
        InputRightElement={
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text mr="3" color={Colors.PRIMARY_COLOR}>
              Change Number
            </Text>
            <Text
              borderBottomColor={Colors.PRIMARY_COLOR}
              borderBottomWidth={1}
              position={'absolute'}
              left={0}
              right={0}
              bottom={0}
              mr="3"
            />
          </TouchableOpacity>
        }
      />
      <View
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        mt={verticalScale(8)}>
        <Images.ErrorIcon />
        <Text color={Colors.ERROR} ml={2} fontFamily={Fonts.POPPINS_MEDIUM}>
          We didn’t find any Jazz Dost account with this number
        </Text>
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
        mt={verticalScale(40)}
        p={'4'}
        borderRadius={16}
        // isDisabled={isLoading}
        isPressed={isLoading}
        onPress={() => {
          setIsLoading(true);
        }}>
        Verify
      </Button>
      <Button
        isLoading={dostLoading}
        variant="solid"
        _text={{
          color: 'BLACK_COLOR',
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
        // _pressed={{
        //   backgroundColor: 'DISABLED_COLOR',
        // }}
        spinnerPlacement="end"
        backgroundColor={'WHITE_COLOR'}
        borderColor={'BLACK_COLOR'}
        borderWidth={1}
        size={'lg'}
        mt={verticalScale(20)}
        p={'4'}
        borderRadius={16}
        // isDisabled={isLoading}
        isPressed={isLoading}
        onPress={() => {
          setDostLoading(true);
          navigation.navigate('JazzDostSignup');
          setDostLoading(false);
        }}>
        <View
          flexDirection={'row'}
          justifyContent={'center'}
          alignItems={'center'}>
          <Text
            color={'BLACK_COLOR'}
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            mr={1}>
            Sign Up on
          </Text>
          <Images.JazzDostIcon width={50} height={20} />
        </View>
      </Button>

      <Modal visible={showDropdown} transparent={true} animationType="slide">
        <CountryPicker
          lang={'en'}
          show={showDropdown}
          // when picker button press you will get the country object with dial code
          pickerButtonOnPress={item => {
            setCountryCode(item.dial_code);
            setShowDropdown(false);
          }}
          style={{
            // Styles for whole modal [View]
            modal: {
              height: verticalScale(500),
            },
          }}
          onBackdropPress={() => {
            setShowDropdown(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default JazzDostVerificationScreen;

const styles = StyleSheet.create({});
