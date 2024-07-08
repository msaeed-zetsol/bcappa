import { Image, View } from "native-base";
import { ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { deepSkyBlue } from "../../constants/Colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getSplash, saveSplash, SplashResponse } from "./SplashHooks";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { notificationListener } from "../../firebase/Notifications";
import { useDispatch } from "react-redux";
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
  const navigation: any = useNavigation();
  const [splash, setSplash] = useState<SplashResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<Destination>();
  const [statusBarColor, setStatusBarColor] = useState(deepSkyBlue);
  const dispatch = useDispatch();

  // both tasks run simultaneously; splash and destination.
  useEffect(() => {
    getSplash(dispatch).then((it) => {
      setSplash(it);
      setLoading(false);
    });
  }, []);

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
    // when the splash is loaded
    if (!loading) {
      // if a splash object has been found
      if (splash) {
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
    }

    // this will only run when splash is loaded and destination is found.
    if (!loading && destination) {
      // the user has to wait at least 2.5 seconds after both are loaded.
      setTimeout(() => {
        // Navigate to destination
        if (destination === "HomeScreen") {
          navigation.replace("BottomNavigator", {
            screen: "HomeScreen",
            show: false,
          });
          notificationListener(navigation);
        } else if (typeof destination === "object") {
          navigation.replace("BcDetailsScreen", {
            item: destination.id,
            deeplink: destination.deepLink,
          });
        } else {
          navigation.replace(destination);
        }
      }, 2500);
    }
  }, [loading, destination]);

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

  if (loading) {
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
      {splash ? (
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
