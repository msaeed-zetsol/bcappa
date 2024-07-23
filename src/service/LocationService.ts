import Geolocation from 'react-native-geolocation-service';
import {Platform, Alert, PermissionsAndroid} from 'react-native';

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          'always',
        );
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        Alert.alert('Please Enable Your Location ');

        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve('granted');
        }
        if (granted === PermissionsAndroid.RESULTS.denied) {
          Alert.alert('Please Enable Your Location');
          return reject('Location Permission denied');
        }
      })
      .catch(error => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
      });
  });
  
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position?.coords?.heading,
        };
        resolve(cords);
      },
      error => {
        reject(error.message);
      },
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 5000},
    );
  });
