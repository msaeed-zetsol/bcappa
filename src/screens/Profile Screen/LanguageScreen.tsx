import React, {useState} from 'react';
import {View, Text} from 'native-base';
import {StatusBar, TouchableOpacity, StyleSheet} from 'react-native';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import {newColorTheme} from '../../constants/Colors';
import Heading from '../../components/Heading';
import {useNavigation} from '@react-navigation/native';
import {Images, Fonts} from '../../constants';

const LanguageScreen = () => {
  const navigation: any = useNavigation();
  const [language, setLanguage] = useState({
    urdu: false,
    english: true,
  });

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
      <Heading name={'Select Language'} navigation={navigation} />
      <View style={{marginTop: verticalScale(50)}}>
        <TouchableOpacity
          onPress={() => {
            setLanguage(prev => ({
              ...prev,
              english: true,
              urdu: false,
            }));
          }}
          style={styles.btnContainer}>
          <View style={styles.btnStyle}>
            <Images.English
              height={verticalScale(40)}
              width={horizontalScale(40)}
            />
            <Text
              style={[
                styles.text,
                {
                  fontSize: verticalScale(18),
                },
              ]}>
              English
            </Text>
          </View>
          {language.english && <Images.Tick />}
        </TouchableOpacity>
        <TouchableOpacity
          
          onPress={() => {
            setLanguage(prev => ({
              ...prev,
              english: false,
              urdu: true,
            }));
          }}
          style={styles.btnContainer}>
          <View style={styles.btnStyle}>
            <Images.Urdu
              height={verticalScale(40)}
              width={horizontalScale(40)}
            />
            <Text style={[styles.text, {fontSize: verticalScale(20)}]}>
              اردو
            </Text>
          </View>
          {language.urdu && <Images.Tick />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LanguageScreen;
const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  btnStyle: {flexDirection: 'row', alignItems: 'center', flex: 1},
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    marginLeft: horizontalScale(15),
  },
});
