import {StyleSheet, StatusBar, TouchableOpacity, Modal} from 'react-native';
import React, {useState} from 'react';
import {
  Button,
  FormControl,
  Icon,
  Input,
  Pressable,
  Text,
  View,
} from 'native-base';
import {newColorTheme} from '../../constants/Colors';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import {Fonts, Images} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {CountryPicker} from 'react-native-country-codes-picker';
import Heading from '../../components/Heading';

const VerifiedAccountDetails = () => {
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState('+92');

  return (
    <View flex={1} bg={'BACKGROUND_COLOR'} px={horizontalScale(20)}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
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
      <Heading name={'Verify Account'} navigation={navigation} />
      <View mt={7} alignItems="center">
        <Images.Congratulations />
        <Text
          fontFamily={Fonts.POPPINS_SEMI_BOLD}
          fontSize={verticalScale(25)}
          mt={6}>
          Your Account is Verified
        </Text>
      </View>
      <FormControl mt={verticalScale(25)}>
        <Input
          // value={userCredentials.email}
          placeholder="Phone Number"
          w="100%"
          size="lg"
          borderRadius={16}
          p="3"
          // pl="6"

          autoCapitalize="none"
          keyboardType="number-pad"
          autoCorrect={false}
          // onChangeText={handleEmail}
          // onBlur={handleBlurForEmail}
          borderColor="BORDER_COLOR"
          placeholderTextColor={'GREY'}
          color={'BLACK_COLOR'}
          fontSize={'sm'}
          fontFamily={Fonts.POPPINS_REGULAR}
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
      </FormControl>
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
        backgroundColor={'RED_COLOR'}
        size={'lg'}
        mt={verticalScale(50)}
        p={'4'}
        borderRadius={16}
        // isDisabled={isLoading}
        isPressed={isLoading}
        onPress={() => {
          setIsLoading(true);


          console.log('hello');
        }}>
        Remove Account
      </Button>
    </View>
  );
};

export default VerifiedAccountDetails;

const styles = StyleSheet.create({});
