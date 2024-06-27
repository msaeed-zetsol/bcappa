import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import React from 'react';
import {Fonts, Images} from '../constants';
import {verticalScale} from '../utilities/Dimensions';

interface items {
  heading?: string;
  onPress?: () => void;
  Image?: any;
  showImage?: boolean;
}

const ProfileItems = ({heading, onPress, Image, showImage}: items) => {
  return (
    <TouchableOpacity style={styles.contentStyles} onPress={onPress}>
      <View flexDirection={'row'} alignItems="center">
        {showImage && <Image height={40} width={40} />}
        <Text
          ml={3}
          color={'#03110A'}
          fontFamily={Fonts.POPPINS_MEDIUM}
          fontSize={verticalScale(18)}>
          {heading}
        </Text>
      </View>
      <Images.ArrowRight />
    </TouchableOpacity>
  );
};

export default ProfileItems;

const styles = StyleSheet.create({
  contentStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(25),
    alignItems: 'center',
  },
});
