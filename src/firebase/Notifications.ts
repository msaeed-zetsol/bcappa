import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import notifee, { AndroidImportance } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      await getFcmToken();
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
  }
}

const getFcmToken = async () => {
  try {
    let fcmToken: string | null = await messaging().getToken();

    if (!fcmToken) {
      // Retry if the token is not immediately available
      messaging().onTokenRefresh((newToken) => {
        fcmToken = newToken;
        const stringifyTheToken: string = JSON.stringify(fcmToken);
        AsyncStorage.setItem("fcmToken", stringifyTheToken);
        console.log("New FCM Token:", fcmToken);
      });
    }

    if (fcmToken) {
      const stringifyTheToken: string = JSON.stringify(fcmToken);
      await AsyncStorage.setItem("fcmToken", stringifyTheToken);
      console.log("FCM Token:", fcmToken);
    } else {
      console.warn("FCM Token not available");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

export async function onDisplayNotification(
  data: FirebaseMessagingTypes.RemoteMessage
) {
  try {
    if (Platform.OS === "ios") {
      await notifee.requestPermission();
    }

    // create channel only required for Android
    const channelId = await notifee.createChannel({
      id: "default ID",
      name: "Default Channel",
      sound: "default",
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: data?.notification?.title || "Default Title",
      body: data?.notification?.body || "Default Body",
      android: {
        channelId,
        smallIcon: "ic_launcher_round",
      },
    });
  } catch (error) {
    console.error("Error displaying notification:", error);
  }
}

export const notificationListener = async (navigation?: any) => {
  try {
    // fired when app is opened from background upon notification click.
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      // TODO(khuram): handle what happens to notification according to its type.
    });

    // returns when app is opened from quite state upon notification click.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        // TODO(khuram): handle what happens to notification according to its type.
        if (remoteMessage) {
          navigation.replace("BottomNavigator", {
            screen: "ExploreScreen",
            show: false,
          });
        }
      });
  } catch (error) {
    console.error("Error in notification listener:", error);
  }
};
