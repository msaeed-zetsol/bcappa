import {StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../constants';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {View} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apimiddleWare} from '../../utilities/HelperFunctions';
import {useDispatch} from 'react-redux';
import {notificationListener} from '../../firebase/Notifications';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const DEEP_LINK_BASE_URL = 'https://invertase.io/offer?id=';

const WelcomeScreen = () => {
  const [someData, setSomeData] = useState<any>();
  const [isDeepLinkId, setIsDeepLinkId] = useState<string | null>(null);
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();

  const initialLoad = async () => {
    await splashData();

    const getUserData: any = await AsyncStorage.getItem('loginUserData');
    setTimeout(() => {
      if (getUserData) {
        navigation.replace('BottomNavigator', {
          screen: 'HomeScreen',
          show: false,
        });
        notificationListener(navigation);
      } else {
        navigation.replace('LoginScreen');
      }
    }, 3000);
  };

  const splashData = async () => {
    const currentDate = new Date();
    const getSplash: any = await AsyncStorage.getItem('splash');
    const parseSplash: any = await JSON.parse(getSplash);
    const endDate = parseSplash?.endDate;
    const endDateTime = new Date(endDate);

    if (currentDate > endDateTime) {
      await AsyncStorage.removeItem('splash');
      await splashApi();
    } else if (parseSplash) {
      setSomeData(parseSplash);
    } else {
      await splashApi();
    }
  };

  const splashApi = async () => {
    try {
      const response = await apimiddleWare({
        url: '/splash-screen',
        method: 'get',
        reduxDispatch: dispatch,
      });

      if (response) {
        const stringifySplash = JSON.stringify(response);
        await AsyncStorage.setItem('splash', stringifySplash);
        setSomeData(response);
      }
    } catch (error) {
      console.error('Error fetching splash data:', error);
    }
  };

  const handleDeepLink = async (link: any) => {
    try {
      console.log('Handling deep link:', link.url);
      const id = link.url.split('id=')[1];

      if (link.url === `${DEEP_LINK_BASE_URL}${id}`) {
        console.log('Valid deep link - navigating to BcDetailsScreen');
        setIsDeepLinkId(id);
        navigation.navigate('BcDetailsScreen', {
          item: id,
          deeplink: true,
        });
      } else {
        console.log('Invalid deep link or navigation condition not met.');
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  const setupLinkHandler = async () => {
    try {
      const link = await dynamicLinks().getInitialLink();

      if (link) {
        console.log('Handling initial deep link');
        handleDeepLink(link);
      } else {
        console.log(' ------------------- initialLoad 1 ------------------- ');
        await initialLoad();
      }

      const unsubscribe = dynamicLinks().onLink(handleDeepLink);

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up link handler:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const cleanupLinkHandler = async () => {
        const cleanup = await setupLinkHandler();
        return cleanup;
      };

      cleanupLinkHandler();
    }, []),
  );

  return (
    <View flex={1}>
      <Image
        source={{uri: someData?.image}}
        resizeMode="cover"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
