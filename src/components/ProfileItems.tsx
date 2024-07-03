import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts} from '../constants';
import {verticalScale} from '../utilities/Dimensions';
import ArrowRight from '../assets/svg/ArrowRight';

interface items {
  heading?: string;
  onPress?: () => void;
  iconName?: string;
  showIcon?: boolean;
}

const ProfileItems = ({heading, onPress, iconName, showIcon}: items) => {
  return (
    <TouchableOpacity style={styles.contentStyles} onPress={onPress}>
      <View flexDirection={'row'} alignItems="center">
        {showIcon && <MaterialIcons name={iconName} size={30} color={Colors.PRIMARY_COLOR} style={styles.iconContainer} />}
        <Text
          ml={3}
          color={'#03110A'}
          fontFamily={Fonts.POPPINS_MEDIUM}
          fontSize={verticalScale(18)}>
          {heading}
        </Text>
      </View>
      <ArrowRight />
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
  iconContainer: {
    backgroundColor:'#cfebfa',
    borderRadius: 22, 
    padding: 6, 
  },
});
