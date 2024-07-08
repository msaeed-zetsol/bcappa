import { Image, View } from "native-base";
import { ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { deepSkyBlue } from "../../constants/Colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getSplash, SplashResponse } from "./SplashHooks";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { notificationListener } from "../../firebase/Notifications";
import { useDispatch } from "react-redux";

type Destination = "HomeScreen" | "LoginScreen" | "OnBoardScreen";

const DEEP_LINK_BASE_URL = "https://invertase.io/offer?id=";

const SplashScreen = () => {
  const navigation: any = useNavigation();
  const [splash, setSplash] = useState<SplashResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<Destination>();
  const dispatch = useDispatch();

  useEffect(() => {
    getSplash(dispatch).then((it) => {
      setSplash(it);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && destination) {
      // the user has to wait at least 2 seconds after both are loaded.
      setTimeout(() => {
        // Navigate to destination
        if (destination === "HomeScreen") {
          navigation.replace("BottomNavigator", {
            screen: "HomeScreen",
            show: false,
          });
          notificationListener(navigation);
        } else {
          navigation.replace(destination);
        }
      }, 2000);
    }
  }, [loading, destination]);

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
        navigation.replace("BcDetailsScreen", {
          item: id,
          deeplink: true,
        });
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

  if (splash) {
    return (
      <View style={{ flex: 1 }}>
        {/* TODO(khuram): show status bar according to the common color of the image. */}
        <Image
          source={{ uri: splash.image }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, style.container]}>
      <StatusBar barStyle={"light-content"} backgroundColor={deepSkyBlue} />
      <Image
        source={require("../../assets/images/splash-logo.png")}
        style={{ width: 200, height: 60 }}
        alt="Bcappa Logo"
      />
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
