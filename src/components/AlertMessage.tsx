import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Modal, Button, View, Text } from 'native-base';
import { horizontalScale, verticalScale } from '../utilities/Dimensions';
import { Images } from '../constants';

export type ModalTypes = {
  Photo?: any;
  message?: string;
  buttonText?: string;
  secondButtonText?: string;
  callback?: (data: { value: boolean; name?: string }) => void;
  secondCallback?: (data: { value: boolean; name?: string }) => void;
  name?: string;
  isButtonPressed?: boolean;
  isSecondButtonPressed?: boolean;
  show?: boolean;
};

const Message = ({
  Photo,
  message,
  buttonText,
  secondButtonText,
  callback,
  secondCallback,
  name,
  isButtonPressed,
  isSecondButtonPressed,
  show,
}: ModalTypes) => {
  return (
    <Modal
      isOpen={show}
      safeAreaTop={true}
      backgroundColor={'rgba(0, 0, 0, 0.63)'}
    >
      <Modal.Content
        width={horizontalScale(325)}
        px={horizontalScale(30)}
        py={verticalScale(10)}
      >
        <Modal.Body>
          <View justifyContent={'center'} alignItems={'center'} mt={3}>
            <Photo />
            <Text color={'GREY'} textAlign={'center'} mt={5}>
              {message}
            </Text>
          </View>
        </Modal.Body>

        <View style={styles.buttonContainer}>
        {secondButtonText && secondCallback && (
            <Button
              backgroundColor={'blueGray.400'}
              borderRadius={15}
              py={5}
              px={8} 
              mr={4}       
              _pressed={{
                backgroundColor: 'DISABLED_COLOR',
              }}
              isPressed={isSecondButtonPressed}
              onPress={() => {
                if (secondCallback) {
                  secondCallback({
                    value: true,
                    name: name,
                  });
                }
              }}
            >
              {secondButtonText}
            </Button>
          )}
          <Button
            backgroundColor={'PRIMARY_COLOR'}
            borderRadius={15}
            py={5}
            px={10}
            _pressed={{
              backgroundColor: 'DISABLED_COLOR',
            }}
            isPressed={isButtonPressed}
            onPress={() => {
              if (callback) {
                callback({
                  value: true,
                  name: name,
                });
              }
            }}
          >
            {buttonText}
          </Button>

        
        </View>
      </Modal.Content>
    </Modal>
  );
};

export default Message;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(5), // Adjust as necessary for spacing from bottom
  },
});
