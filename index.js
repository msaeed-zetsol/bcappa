import "react-native-gesture-handler";
import "./firebaseConfig"; // Import Firebase config and initialize
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import "./src/localization/config";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Settings } from 'react-native-fbsdk-next';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background', remoteMessage);
});

Settings.initializeSDK();

const ReduxApp = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </NavigationContainer>
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
