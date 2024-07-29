import { View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { verticalScale } from "../../utilities/dimensions";
import { Colors, Images } from "../../constants";
import { useTranslation } from "react-i18next";
import BottomNavIcon from "../../components/BottomNavIcon";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import MyBcsScreen from "../../screens/My BC's Screen/MyBcsScreen";
import ExploreScreen from "../../screens/explore/ExploreScreen";
import NotificationScreen from "../../screens/notifications/NotificationScreen";
import ProfileScreen from "../../screens/Profile Screen/ProfileScreen";
import { Image } from "native-base";
import { wildWatermelon } from "../../constants/Colors";

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE_COLOR }}>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopStartRadius: 22,
            borderTopEndRadius: 22,
            borderWidth: 1,
            borderColor: "transparent",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,

            elevation: 16,
            height: verticalScale(90),
            backgroundColor: Colors.WHITE_COLOR,
          },
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <BottomNavIcon
                  text={t("home")}
                  icons={{
                    FocusedIcon: Images.Home_Blue,
                    UnfocusedIcon: Images.Home,
                  }}
                  focused={focused}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="MyBcsScreen"
          component={MyBcsScreen}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <BottomNavIcon
                  text={t("my_bcs")}
                  icons={{
                    FocusedIcon: Images.MyBc_Blue,
                    UnfocusedIcon: Images.MyBc,
                  }}
                  focused={focused}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="ExploreScreen"
          component={ExploreScreen}
          options={{
            tabBarIcon: () => {
              return (
                <View
                  style={{
                    position: "absolute",
                    width: verticalScale(80),
                    height: verticalScale(80),
                    backgroundColor: wildWatermelon,
                    borderRadius: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    bottom: verticalScale(43),
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,

                    elevation: 2,
                  }}
                >
                  <Image
                    source={require("../../assets/images/explore.png")}
                    size={30}
                    alt="explore"
                  />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <BottomNavIcon
                  text={t("notifications")}
                  icons={{
                    FocusedIcon: Images.NotificationBlue,
                    UnfocusedIcon: Images.Notification,
                  }}
                  focused={focused}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <BottomNavIcon
                  text={t("profile")}
                  icons={{
                    FocusedIcon: Images.Profile_Blue,
                    UnfocusedIcon: Images.Profile,
                  }}
                  focused={focused}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigator;
