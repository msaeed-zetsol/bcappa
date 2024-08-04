import React, { useEffect } from "react";
import BootSplash from "react-native-bootsplash";
import StackNavigator from "./src/navigators/stack-navigator/StackNavigator";
import { NativeBaseProvider, extendTheme } from "native-base";
import { newColorTheme } from "./src/constants/Colors";
import {
  onDisplayNotification,
  requestUserPermission,
} from "./src/utilities/firebase-notifications";
import { useSelector } from "react-redux";
import { RootState } from "./src/redux/store";
import ErrorModal from "./src/components/ErrorModal";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { StackActions, useNavigation } from "@react-navigation/native";

const DEEP_LINK_BASE_URL = "https://invertase.io/offer?id=";

export default function App() {
  const { message, value }: any = useSelector(
    (state: RootState) => state.users.ErrorModal
  );
  const theme = extendTheme({ colors: newColorTheme });
  const navigation = useNavigation();

  useEffect(() => {
    requestUserPermission();
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }, []);

  useEffect(() => {
    // notification received in foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink((link) => {
      const id = link.url.split("id=")[1];
      if (link.url === `${DEEP_LINK_BASE_URL}${id}`) {
        navigation.dispatch(
          StackActions.replace("BcDetailsScreen", {
            item: id,
            deeplink: true,
          })
        );
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    BootSplash.hide({ fade: true });
  });

  return (
    <NativeBaseProvider theme={theme}>
      {value && <ErrorModal message={message} />}
      <StackNavigator />
    </NativeBaseProvider>
  );
}
