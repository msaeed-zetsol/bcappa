import React, { useEffect, useState } from "react";
import StackNavigator from "./src/navigators/StackNavigator/StackNavigator";
import { NativeBaseProvider, extendTheme } from "native-base";
import { newColorTheme } from "./src/constants/Colors";
import { requestUserPermission } from "./src/firebase/Notifications";
import { useSelector } from "react-redux";
import { RootState } from "./src/redux/store";
import ErrorModal from "./src/components/ErrorModal";
export default function App() {
  const { message, value }: any = useSelector(
    (state: RootState) => state.users.ErrorModal
  );
  const theme = extendTheme({ colors: newColorTheme });

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      {value && <ErrorModal message={message} />}
      <StackNavigator />
    </NativeBaseProvider>
  );
}
