import React, {useEffect} from 'react';
import StackNavigator from './src/navigators/StackNavigator/StackNavigator';
import {NativeBaseProvider, extendTheme} from 'native-base';
import {newColorTheme} from './src/constants/Colors';
import {requestUserPermission} from './src/firebase/Notifications';
import {useSelector} from 'react-redux';
import {RootState} from './src/redux/store';

import ErrorModal from './src/components/ErrorModal';
const App = () => {
  const {message, value}: any = useSelector(
    (state: RootState) => state.users.ErrorModal,
  );

  useEffect(() => {
    requestUserPermission();
  }, []);
  const theme = extendTheme({colors: newColorTheme});
  return (
    <NativeBaseProvider theme={theme}>
      {value && <ErrorModal message={message} />}
      <StackNavigator />
    </NativeBaseProvider>
  );
};

export default App;
