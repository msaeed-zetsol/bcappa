import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import { Colors } from '../../constants';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE_COLOR }}>
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
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons
                  name="home"
                  color={focused ? Colors.PRIMARY_COLOR : Colors.GREY}
                  size={focused ? horizontalScale(35) : horizontalScale(30)}
                />
                <Text
                  style={{
                    color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                    fontSize: verticalScale(13),
                    marginTop: verticalScale(5),
                    fontWeight: '500',
                  }}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="MyBcsScreen"
          component={MyBcsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons
                  name="business-center"
                  color={focused ? Colors.PRIMARY_COLOR : Colors.GREY}
                  size={focused ? horizontalScale(37) : horizontalScale(32)}
                />
                <Text
                  style={{
                    color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                    fontSize: verticalScale(13),
                    marginTop: verticalScale(5),
                    fontWeight: '500',
                  }}
                >
                  My Bc's
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ExploreScreen"
          component={ExploreScreen}
          options={{
            tabBarIcon: () => (
              <View style={{ position: 'absolute', bottom: verticalScale(20) }}>
                <MaterialIcons
                  name="explore"
                  size={verticalScale(90)}
                  color={Colors.PRIMARY_COLOR}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons
                  name="notifications"
                  color={focused ? Colors.PRIMARY_COLOR : Colors.GREY}
                  size={focused ? horizontalScale(37) : horizontalScale(33)}
                />
                <Text
                  style={{
                    color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                    fontSize: verticalScale(13),
                    marginTop: verticalScale(5),
                    fontWeight: '500',
                  }}
                >
                  Notifications
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons
                  name="person"
                  color={focused ? Colors.PRIMARY_COLOR : Colors.GREY}
                  size={focused ? horizontalScale(37) : horizontalScale(32)}
                />
                <Text
                  style={{
                    color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
                    fontSize: verticalScale(13),
                    marginTop: verticalScale(5),
                    fontWeight: '500',
                  }}
                >
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({});
