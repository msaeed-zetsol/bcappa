// firebaseConfig.js
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyD34jzx42Ss1mI4u0GuFlkWVLVQrGC1ty4',
  authDomain: 'bcappa-82c60.firebaseapp.com',
  databaseURL: 'https://bcappa-82c60.firebaseio.com',
  projectId: 'bcappa-82c60',
  storageBucket: 'bcappa-82c60.appspot.com',
  messagingSenderId: '425837288874',
  appId: '1:425837288874:android:e65ab76435bf66091a1fd3',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
