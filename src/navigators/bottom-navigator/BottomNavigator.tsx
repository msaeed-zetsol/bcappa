import { View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { verticalScale } from "../../utilities/dimensions";
import { Colors, Images } from "../../constants";
import { useTranslation } from "react-i18next";
import BottomNavIcon from "../../components/BottomNavIcon";
import HomeScreen from "../../screens/home/HomeScreen";
import MyBcsScreen from "../../screens/bcs/MyBcsScreen";
import ExploreScreen from "../../screens/explore/ExploreScreen";
import NotificationScreen from "../../screens/notifications/NotificationScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import { Image } from "native-base";
import { wildWatermelon } from "../../constants/Colors";

export type TabParamsList = {
  HomeScreen: undefined;
  MyBcsScreen: undefined;
  ExploreScreen: undefined;
  NotificationScreen: undefined;
  ProfileScreen: undefined;
};

const Tab = createBottomTabNavigator<TabParamsList>();

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
                    width: verticalScale(67),
                    height: verticalScale(67),
                    backgroundColor: wildWatermelon,
                    borderRadius: 67,
                    justifyContent: "center",
                    alignItems: "center",
                    bottom: verticalScale(47),
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                >
                  <Image
                    source={require("../../assets/images/explore.png")}
                    size={verticalScale(26)}
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
