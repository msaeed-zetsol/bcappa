import React, { useEffect } from "react";
import StackNavigator from "./src/navigators/StackNavigator/StackNavigator";
import { NativeBaseProvider, extendTheme } from "native-base";
import { newColorTheme } from "./src/constants/Colors";
import {
  onDisplayNotification,
  requestUserPermission,
} from "./src/firebase/Notifications";
import { useSelector } from "react-redux";
import { RootState } from "./src/redux/store";
import ErrorModal from "./src/components/ErrorModal";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";

export default function App() {
  const { message, value }: any = useSelector(
    (state: RootState) => state.users.ErrorModal
  );
  const theme = extendTheme({ colors: newColorTheme });

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

  return (
    <NativeBaseProvider theme={theme}>
      {value && <ErrorModal message={message} />}
      <StackNavigator />
    </NativeBaseProvider>
  );
}
