import { StyleSheet, Text, Modal } from "react-native";
import React from "react";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { Fonts, Colors, Images } from "../constants";
import { setErrors } from "../redux/user/userSlice";
import { Button } from "native-base";
import { View } from "react-native-animatable";
import { useAppDispatch } from "../hooks/hooks";

const ErrorModal = ({ message }: any) => {
  const dispatch = useAppDispatch();

  return (
    <Modal
      statusBarTranslucent
      transparent
      presentationStyle="overFullScreen"
      style={{
        flex: 1,
      }}
      visible={true}
    >
      <View style={styles.centeredView}>
        <View
          animation={"bounceIn"}
          style={[
            styles.modalView,
            {
              paddingHorizontal: horizontalScale(22),
              paddingVertical: verticalScale(20),
            },
          ]}
        >
          <Images.ErrorModals
            height={verticalScale(200)}
            width={verticalScale(200)}
          />
          <Text style={styles.message}>{message}</Text>
          <Button
            colorScheme={"error"}
            style={styles.closeButton}
            onPress={() => dispatch(setErrors({ value: false }))}
          >
            <Text style={styles.closeButtonLabel}>Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    height: 66,
    width: "100%",
    borderRadius: 16,
  },
  closeButtonLabel: {
    color: "white",
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(18),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.63)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    width: "90%",
  },
  message: {
    paddingVertical: 24,
    fontSize: verticalScale(18),
    color: Colors.ERROR,
    lineHeight: verticalScale(25),
    textAlign: "center",
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
  },
});

export default ErrorModal;
