import {StyleSheet, Text, View, Modal, StatusBar} from 'react-native';
import React from 'react';
import {horizontalScale, verticalScale} from '../utilities/Dimensions';
import {TouchableOpacity} from 'react-native';
import {Fonts, Colors, Images} from '../constants';
import {useDispatch} from 'react-redux';
import {errors} from '../redux/user/userSlice';
import * as Animatable from 'react-native-animatable';

const ErrorModal = ({message}: any) => {
  const dispatch: any = useDispatch();

  return (
    <Modal
      style={{
        flex: 1,
      }}
      transparent
      visible={true}>
      <Animatable.View style={styles.centeredView}>
        <Animatable.View
          animation={'bounceIn'}
          style={[
            styles.modalView,
            {
              paddingHorizontal: horizontalScale(22),
              paddingVertical: verticalScale(20),
            },
          ]}>
          <Images.ErrorModals
            height={verticalScale(200)}
            width={verticalScale(200)}
          />
          <View style={styles.textContainer}>
            <Text style={styles.modalText}>Something went wrong!!</Text>
            <Text style={styles.title}>{message}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() => {
                dispatch(errors({value: false}));
              }}
              style={{
                backgroundColor: Colors.ERROR,
                padding: verticalScale(12),
                alignItems: 'center',
                borderRadius: 15,
                marginTop: verticalScale(30),
                width: '100%',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: Fonts.POPPINS_SEMI_BOLD,
                  fontSize: verticalScale(18),
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </Animatable.View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.63)',
  },
  modalView: {
    // paddingVertical: verticalScale(5),
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    width: '90%',
    // height: '100%',
  },
  modalText: {
    textAlign: 'center',
    fontSize: verticalScale(18),
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    color: Colors.GREY,
  },
  textContainer: {
    marginVertical: verticalScale(10),
  },
  title: {
    fontSize: verticalScale(18),
    // fontWeight: 'bold',
    color: Colors.ERROR,
    marginTop: verticalScale(10),
    lineHeight: verticalScale(25),
    textAlign: 'center',
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
  },
});
