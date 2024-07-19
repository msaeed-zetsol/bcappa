import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Modal, Button, View, Text} from 'native-base';
import {horizontalScale, verticalScale} from '../utilities/Dimensions';
import {Images} from '../constants';

type InfoModalProps = {
  Photo?: any;
  message?: any;
  buttonText?: any;
  callback?: any;
  name?: any;
  isButtonPressed?: any;
  show?: boolean;
  onClose?: () => void;
};

const InfoModal = ({
  Photo,
  message,
  buttonText,
  callback,
  name,
  isButtonPressed,
  show,
  onClose,
}: InfoModalProps) => {
  return (
    <Modal
      isOpen={true}
      safeAreaTop={true}
      backgroundColor={"rgba(0, 0, 0, 0.63)"}
    >
      <Modal.Content
        width={horizontalScale(325)}
        px={horizontalScale(30)}
        py={verticalScale(10)}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            alignSelf: "flex-end",
            marginTop: 4,
          }}
        >
          <Images.Cross />
        </TouchableOpacity>
        <Modal.Body>
          <View justifyContent={"center"} alignItems={"center"} mt={3}>
            <Photo />

            <Text color={"GREY"} textAlign={"center"} mt={5}>
              {message}
            </Text>
          </View>
        </Modal.Body>
        <Button
          backgroundColor={"PRIMARY_COLOR"}
          borderRadius={15}
          py={5}
          mb={5}
          _pressed={{
            backgroundColor: "DISABLED_COLOR",
          }}
          isPressed={isButtonPressed}
          onPress={() => {
            callback({
              value: true,
              name: name,
            });
          }}
        >
          {buttonText}
        </Button>
      </Modal.Content>
    </Modal>
  );
};

export default InfoModal;