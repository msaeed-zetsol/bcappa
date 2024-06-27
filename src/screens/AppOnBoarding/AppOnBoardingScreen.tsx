import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {OnboardFlow} from 'react-native-onboard';
import {Colors} from '../../constants';

export default function OnBoardScreen() {
  const navigation: NavigationProp<any> = useNavigation();
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('onboardingComplete').then(value => {
      if (value === 'true') {
        setOnboardingComplete(true);
        navigation.navigate('WelcomeScreen');
      } else {
        setOnboardingComplete(false);
      }
    });
  }, []);

  if (onboardingComplete) {
    return;
  }

  return (
    <View style={styles.container}>
      <OnboardFlow
        pages={[
          {
            title: 'Welcome to BC Appa 👋 ',
            subtitle:
              'Empower your savings journey! Join or create savings circles with friends and family. Experience the joy of financial collaboration.',
            imageUri: Image.resolveAssetSource(
              require('../../assets/OnBoarding1.png'),
            ).uri,
          },
          {
            title: 'Start Savings Together',
            subtitle:
              'Create a new committee or join existing ones. Swap and create a BC with users just like you to build a financial community.',
            imageUri: Image.resolveAssetSource(
              require('../../assets/OnBoarding2.png'),
            ).uri,
          },
          {
            title: 'Take Control of Your BCs',
            subtitle:
              'Manage your savings circle effortlessly. Track contributions and experience the thrill of achieving financial goals together.',
            imageUri: Image.resolveAssetSource(
              require('../../assets/OnBoarding3.png'),
            ).uri,
          },
        ]}
        type="fullscreen" // Change to either 'fullscreen', 'bottom-sheet', or 'inline'
        autoPlay={true}
        onDone={() => {
          // save onboarding status
          AsyncStorage.setItem('onboardingComplete', 'true');
          navigation.navigate('WelcomeScreen');
        }}
        paginationColor={Colors.DISABLED_COLOR}
        paginationSelectedColor={Colors.PRIMARY_COLOR}
        primaryColor={Colors.PRIMARY_COLOR}
        primaryButtonTextStyle={{
          fontSize: 16,
          backgroundColor: Colors.PRIMARY_COLOR,
          borderRadius: 16,
        }}
        titleStyle={{
          fontSize: 32,
          lineHeight: 50,
        }}
        subtitleStyle={{
          fontSize: 18,
          lineHeight: 24,
        }}
        textStyle={{
          fontSize: 16,
          lineHeight: 24,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
