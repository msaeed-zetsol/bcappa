import {StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import React from 'react';
import {View, Text} from 'native-base';
import {verticalScale, horizontalScale} from '../../utilities/Dimensions';
import {Fonts, Images} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {newColorTheme} from '../../constants/Colors';
import ProfileItems from '../../components/ProfileItems';
import Heading from '../../components/Heading';

const FaqAndSupportScreen = () => {
  const navigation: any = useNavigation();
  return (
    <View
      flex={1}
      bg={'BACKGROUND_COLOR'}
      pt={verticalScale(15)}
      px={horizontalScale(22)}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <Heading name={"FAQ's"} navigation={navigation} />

      <View mt={verticalScale(30)} />
      <ProfileItems heading={'What is Bc Appa'} onPress={() => {}} />
      <ProfileItems heading={'General Information'} onPress={() => {}} />
      <ProfileItems heading={'Payments'} onPress={() => {}} />
      <ProfileItems heading={'How it works?'} onPress={() => {}} />
    </View>
  );
};

export default FaqAndSupportScreen;

const styles = StyleSheet.create({});
