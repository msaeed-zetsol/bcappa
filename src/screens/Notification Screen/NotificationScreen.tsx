import {
  StatusBar,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'native-base';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Colors, {newColorTheme} from '../../constants/Colors';
import {Fonts, Images} from '../../constants';
import {Notifications} from '../../interface/Interface';
import {apimiddleWare} from '../../utilities/HelperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import ErrorNotification from '../../assets/svg/ErrorNotification';
import CongratulationsNotification from '../../assets/svg/CongratulationsNotification';

const NotificationScreen = () => {
  const [notification, setNotification] = useState<Notifications[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch: any = useDispatch();
  const getNoti = async () => {
    const getUserData: any = await AsyncStorage.getItem('loginUserData');
    const userData = JSON.parse(getUserData);
    setLoading(true);
    const response = await apimiddleWare({
      url: `/notifications/my`,
      method: 'get',
      reduxDispatch: dispatch,
    });
    if (response) {
      setLoading(false);
      setNotification(response);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getNoti();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.genralContainer}>
        <ActivityIndicator size={'large'} color={Colors.PRIMARY_COLOR} />
      </View>
    );
  }
  return (
    <View
      flex={1}
      bg={'BACKGROUND_COLOR'}
      pt={verticalScale(15)}
      px={horizontalScale(22)}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <View alignItems="center" mt={verticalScale(25)}>
        <Text
          textAlign="center"
          fontSize={verticalScale(22)}
          color={'#06202E'}
          letterSpacing={0.2}
          fontFamily={Fonts.POPPINS_BOLD}>
          Notification
        </Text>
      </View>
      {notification.length === 0 && (
        <View style={styles.container}>
          <Text style={{fontFamily: Fonts.POPPINS_SEMI_BOLD}}>
            Notifications Not Found
          </Text>
        </View>
      )}
      {!loading && (
        <FlatList
          data={notification}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: verticalScale(30),
          }}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                console.log('');
              }}
              colors={['#009387']} // Customize the color of the loading indicator
            />
          }
          renderItem={({item, index}: any) => {
            console.log({item});
            const date = new Date(item.createdAt);
            let createDate = item.createdAt.split('T')[0];
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
            const year = date.getFullYear();

            // Format day and month to have leading zeros if needed
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = month < 10 ? `0${month}` : month;

            // Construct the / / format
            const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;

            const pakistaniTime = new Intl.DateTimeFormat('en-US', {
              timeZone: 'Asia/Karachi',
              hour12: true,
              hour: '2-digit',
              minute: '2-digit',
            }).format(date);
            console.log({pakistaniTime});

            return (
              <TouchableOpacity
                key={index}
                style={{
                  marginTop: verticalScale(25),
                  marginHorizontal: horizontalScale(5),
                }}>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <Text
                    color={'#090A0A'}
                    fontFamily={Fonts.POPPINS_MEDIUM}
                    fontSize={verticalScale(13)}>
                    {formattedDate}
                    {', '}
                  </Text>
                  <Text
                    color={'#090A0A'}
                    fontFamily={Fonts.POPPINS_MEDIUM}
                    fontSize={verticalScale(13)}>
                    {pakistaniTime}
                  </Text>
                </View>
                <View
                  justifyContent={'space-between'}
                  flexDirection={'row'}
                  alignItems={'center'}>
                  <View flexDirection={'row'} alignItems={'center'}>
                    {item.status === 0 ? (
                      <ErrorNotification />
                    ) : (
                      <CongratulationsNotification
                      />
                    )}

                    <View ml={2}>
                      <Text
                        color={'#090A0A'}
                        fontFamily={Fonts.POPPINS_SEMI_BOLD}
                        fontSize={verticalScale(15)}>
                        {item.title}
                      </Text>
                      <Text
                        width={'71%'}
                        color={'#777777'}
                        fontFamily={Fonts.POPPINS_MEDIUM}
                        fontSize={verticalScale(14)}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  genralContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
