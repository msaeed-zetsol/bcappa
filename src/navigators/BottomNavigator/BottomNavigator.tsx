import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ExploreScreen,
  HomeScreen,
  MyBcsScreen,
  NotificationScreen,
  ProfileScreen,
} from '../../screens';
import {
  verticalScale,
  moderateScale,
  horizontalScale,
} from '../../utilities/Dimensions';
import {Colors, Images} from '../../constants';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.WHITE_COLOR}}>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopRightRadius: moderateScale(30),
            borderTopLeftRadius: moderateScale(30),
            elevation: 80,
            height: verticalScale(90),
            shadowOffset: {
              width: 0,
              height: 20,
            },
            shadowOpacity: 1,
            shadowRadius: 80,
            backgroundColor: Colors.WHITE_COLOR,
          },
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {focused ? (
                    <Images.Home_Blue
                      resizeMode="contain"
                      width={horizontalScale(35)}
                      height={verticalScale(35)}
                    />
                  ) : (
                    <Images.Home
                      resizeMode="contain"
                      width={horizontalScale(30)}
                      height={verticalScale(30)}
                    />
                  )}

                  <Text
                    style={{
                      color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                      fontSize: verticalScale(13),
                      marginTop: verticalScale(5),
                      fontWeight: '500',
                    }}>
                    Home
                  </Text>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="MyBcsScreen"
          component={MyBcsScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View
                  style={{
                    alignItems: 'center',

                    justifyContent: 'center',
                  }}>
                  {focused ? (
                    <Images.MyBc_Blue
                      resizeMode="contain"
                      width={horizontalScale(37)}
                      height={verticalScale(37)}
                    />
                  ) : (
                    <Images.MyBc
                      resizeMode="contain"
                      width={horizontalScale(32)}
                      height={verticalScale(32)}
                    />
                  )}

                  <Text
                    style={{
                      color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                      fontSize: verticalScale(13),
                      marginTop: verticalScale(5),
                      fontWeight: '500',
                    }}>
                    My Bc's
                  </Text>
                </View>
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
                <View style={{position: 'absolute', bottom: verticalScale(20)}}>
                  <Images.Explore
                    width={verticalScale(110)}
                    height={verticalScale(110)}
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
            tabBarIcon: ({focused}) => {
              return (
                <View
                  style={{
                    alignItems: 'center',

                    justifyContent: 'center',
                  }}>
                  {focused ? (
                    <Images.NotificationBlue
                      resizeMode="contain"
                      width={horizontalScale(37)}
                      height={verticalScale(37)}
                    />
                  ) : (
                    <Images.Notification
                      resizeMode="contain"
                      width={horizontalScale(33)}
                      height={verticalScale(33)}
                    />
                  )}

                  <Text
                    style={{
                      color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                      fontSize: verticalScale(13),
                      marginTop: verticalScale(5),
                      fontWeight: '500',
                    }}>
                    Notifications
                  </Text>
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {focused ? (
                    <Images.Profile_Blue
                      resizeMode="contain"
                      width={horizontalScale(37)}
                      height={verticalScale(37)}
                    />
                  ) : (
                    <Images.Profile
                      resizeMode="contain"
                      width={horizontalScale(32)}
                      height={verticalScale(32)}
                    />
                  )}
                  <Text
                    style={{
                      color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                      fontSize: verticalScale(13),
                      marginTop: verticalScale(5),
                      fontWeight: '500',
                    }}>
                    Profile
                  </Text>
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({});
