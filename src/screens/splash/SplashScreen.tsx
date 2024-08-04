import { Image, View } from "native-base";
import { ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { deepSkyBlue } from "../../constants/Colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";
import useSplash, { saveSplash } from "../../hooks/useSplash";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { notificationListener } from "../../utilities/firebase-notifications";
import { getColors } from "react-native-image-colors";

type Destination =
  | "HomeScreen"
  | "LoginScreen"
  | "OnBoardScreen"
  | BcDetailsScreen;

type BcDetailsScreen = {
  id: string;
  deepLink: boolean;
};

const DEEP_LINK_BASE_URL = "https://invertase.io/offer?id=";

const SplashScreen = () => {
  const [destination, setDestination] = useState<Destination>();
  const [statusBarColor, setStatusBarColor] = useState(deepSkyBlue);
  const { splash, status } = useSplash();
  const navigation = useNavigation();

  // both tasks run simultaneously; splash and destination.
  // `useSplash` hook runs code to find the splash immediately.
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          handleDeepLink(link);
        } else {
          findDestinationRoute();
        }
      });
  }, []);

  useEffect(() => {
    /**
     * This piece of code tries to set status bar color.
     * according to the splash image's vibrant color.
     * Since this is dependent on splash image,
     * it will execute only when a splash has been found.
     */
    if (status === "found") {
      if (splash.statusBarColor) {
        setStatusBarColor(splash.statusBarColor);
      } else {
        getColors(splash.image, {
          fallback: "#fff",
          cache: true,
          key: `${splash.id}`,
        }).then((result) => {
          switch (result.platform) {
            case "android":
              splash.statusBarColor = result.darkVibrant;
              break;
            case "ios":
              splash.statusBarColor = result.secondary;
              break;
            case "web":
              splash.statusBarColor = result.darkVibrant;
              break;
          }
          setStatusBarColor(splash.statusBarColor);
          saveSplash(splash);
        });
      }
    }

    /**
     * This piece of code will execute only when;
     * - The effort to find a splash is finished.
     * - A suitable destination is found.
     *
     * We are checking the status here, both `found` and `not found` refers
     * to the fact that the effort to find a splash has been finished.
     * It doesn't matter if we found a splash or not.
     */
    if ((status === "found" || status === "not found") && destination) {
      // user has to wait at-least 2.5 seconds
      setTimeout(() => {
        // Navigate to destination
        if (destination === "HomeScreen") {
          navigation.dispatch(
            StackActions.replace("BottomNavigator", {
              screen: "HomeScreen",
              show: false,
            })
          );
          notificationListener(navigation);
        } else if (typeof destination === "object") {
          navigation.dispatch(
            StackActions.replace("BcDetailsScreen", {
              item: destination.id,
              deeplink: destination.deepLink,
            })
          );
        } else {
          navigation.dispatch(StackActions.replace(destination));
        }
      }, 2000);
    }
  }, [status, destination]);

  const findDestinationRoute = async () => {
    const completed = await AsyncStorage.getItem("onboardingComplete");
    if (completed) {
      const userData = await AsyncStorage.getItem("loginUserData");
      if (userData) {
        setDestination("HomeScreen");
      } else {
        setDestination("LoginScreen");
      }
    } else {
      setDestination("OnBoardScreen");
    }
  };

  const handleDeepLink = async (link: any) => {
    try {
      const id = link.url.split("id=")[1];

      if (link.url === `${DEEP_LINK_BASE_URL}${id}`) {
        setDestination({ id: id, deepLink: true });
      } else {
        findDestinationRoute();
      }
    } catch (error) {
      findDestinationRoute();
    }
  };

  if (status === "loading") {
    return (
      <View style={[StyleSheet.absoluteFill, style.container]}>
        <StatusBar barStyle={"light-content"} backgroundColor={deepSkyBlue} />
        <ActivityIndicator color="white" size={36} />
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, style.container]}>
      <StatusBar barStyle={"light-content"} backgroundColor={statusBarColor} />
      {status === "found" && splash.image ? (
        <Image
          source={{ uri: splash.image }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
          alt="Splash Image"
        />
      ) : (
        <Image
          source={require("../../assets/images/splash-logo.png")}
          style={{ width: 200, height: 60 }}
          alt="Bcappa Logo"
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: deepSkyBlue,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
