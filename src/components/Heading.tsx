import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import {horizontalScale, verticalScale} from '../utilities/Dimensions';
import {Fonts, Images} from '../constants';
const Heading = ({name, navigation, color, onPress}: any) => {
  return (
    <View
      flexDirection="row"
      alignItems="center"
      mt={verticalScale(25)}
      justifyContent={'center'}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 0,
        }}
        onPress={
          onPress
            ? onPress
            : () => {
                console.log('Pressed');
                navigation.goBack();
              }
        }>
        <Images.BackButton
          wdith={horizontalScale(50)}
          height={verticalScale(50)}
        />
      </TouchableOpacity>
      <Text
        textAlign="center"
        fontSize={verticalScale(20)}
        color={color ? color : '#06202E'}
        // letterSpacing={0.2}
        fontFamily={Fonts.POPPINS_BOLD}>
        {name}
      </Text>
    </View>
  );
};

export default Heading;
