import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
      await getFcmToken();
    } else {
      console.log('Authorization denied');
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
}

const getFcmToken = async () => {
  try {
    let fcmToken: string | null = await messaging().getToken();

    if (!fcmToken) {
      // Retry if the token is not immediately available
      messaging().onTokenRefresh(newToken => {
        fcmToken = newToken;
        const stringifyTheToken: string = JSON.stringify(fcmToken);
        AsyncStorage.setItem('fcmToken', stringifyTheToken);
        console.log('New FCM Token:', fcmToken);
      });
    }

    if (fcmToken) {
      const stringifyTheToken: string = JSON.stringify(fcmToken);
      await AsyncStorage.setItem('fcmToken', stringifyTheToken);
      console.log('FCM Token:', fcmToken);
    } else {
      console.warn('FCM Token not available');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export async function onDisplayNotification(
  data: FirebaseMessagingTypes.RemoteMessage,
) {
  try {
    if (Platform.OS === 'ios') {
      await notifee.requestPermission();
    }

    // create channel only required for Android
    const channelId = await notifee.createChannel({
      id: 'default ID',
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: data?.notification?.title || 'Default Title',
      body: data?.notification?.body || 'Default Body',
      android: {
        channelId,
        smallIcon: 'ic_launcher_round',
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
}

export const notificationListener = async (navigation?: any) => {
  try {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // Handle navigation or other actions based on the notification data
    });

    messaging().onMessage(async remoteMessage => {
      console.log('Received in foreground:', remoteMessage);
      onDisplayNotification(remoteMessage);
    });

    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log(
        'Notification caused app to open from quit state:',
        initialNotification.notification,
      );
      console.log({navigation});
      console.log({initialNotification});
      navigation.replace('BottomNavigator', {
        screen: 'ExploreScreen',
        show: false,
      });
    }
  } catch (error) {
    console.error('Error in notification listener:', error);
  }
};
