import React from 'react';
import {View, Text} from 'native-base';
import {StatusBar} from 'react-native';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Colors, {newColorTheme} from '../../constants/Colors';
import Heading from '../../components/Heading';
import {useNavigation} from '@react-navigation/native';
import {Fonts, Images} from '../../constants';

const MyRewardsScreen = () => {
  const navigation: any = useNavigation();
  return (
    <View flex={1} bg={'BACKGROUND_COLOR'}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={newColorTheme.PRIMARY_COLOR}
      />
      <View
        bg={'PRIMARY_COLOR'}
        px={horizontalScale(20)}
        height={verticalScale(300)}>
        <Heading
          name={'Rewards'}
          navigation={navigation}
          color={Colors.WHITE_COLOR}
        />

        <View
          bg={'WHITE_COLOR'}
          mt={verticalScale(40)}
          //   height={120}
          borderRadius={10}
          py={verticalScale(20)}>
          <View justifyContent={'center'} alignItems={'center'}>
            <Text color={Colors.LIGHT_GREY} fontFamily={Fonts.POPPINS_MEDIUM}>
              Current Badege
            </Text>
            <View flexDirection={'row'} alignItems={'center'}>
              <Text
                color={Colors.BLACK_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(20)}
                mr={1}>
                Silver
              </Text>
              <Images.Trophy />
            </View>
          </View>
          <View
            mt={verticalScale(15)}
            flexDirection={'row'}
            justifyContent={'space-around'}
            alignItems={'center'}
            px={1}>
            <View justifyContent={'center'} alignItems={'center'}>
              <Text
                color={Colors.LIGHT_GREY}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(14)}>
                Active Goals
              </Text>
              <Text
                color={Colors.PRIMARY_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(25)}>
                02
              </Text>
            </View>
            <View justifyContent={'center'} alignItems={'center'}>
              <Text
                color={Colors.LIGHT_GREY}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(14)}>
                Goals Completed
              </Text>
              <Text
                color={Colors.PRIMARY_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(25)}>
                02
              </Text>
            </View>
            <View justifyContent={'center'} alignItems={'center'}>
              <Text
                color={Colors.LIGHT_GREY}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(14)}>
                Badge Earned
              </Text>
              <Text
                color={Colors.PRIMARY_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(25)}>
                02
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Text
        mx={horizontalScale(20)}
        color={Colors.LIGHT_GREY}
        fontSize={verticalScale(22)}
        fontFamily={Fonts.POPPINS_SEMI_BOLD}
        my={verticalScale(12)}>
        All Goals
      </Text>
      
    </View>
  );
};

export default MyRewardsScreen;