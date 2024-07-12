import { StyleSheet, Text, Modal } from "react-native";
import React from "react";
import {
  height,
  horizontalScale,
  verticalScale,
} from "../utilities/Dimensions";
import { Fonts, Colors, Images } from "../constants";
import { Button, Image } from "native-base";
import { View } from "react-native-animatable";
import { useTranslation } from "react-i18next";
import { deepSkyBlue } from "../constants/Colors";

type ForceRestartModalProps = {
  visible: boolean;
  onRestart: () => void;
  onDismiss: () => void;
};

const ForceRestartModal = ({
  visible,
  onDismiss,
  onRestart,
}: ForceRestartModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      statusBarTranslucent
      transparent
      presentationStyle="overFullScreen"
      visible={visible}
      onDismiss={onDismiss}
      onRequestClose={onDismiss}
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
          <View style={styles.circle}>
            <Text style={styles.circleText}>?</Text>
          </View>
          <Text style={styles.message}>{t("app_needs_to_restart")}</Text>
          <View style={{ flexDirection: "row" }}>
            <Button style={styles.closeButton} onPress={onDismiss}>
              <Text style={styles.closeButtonLabel}>{t("close")}</Text>
            </Button>
            <Button style={styles.button} onPress={onRestart}>
              <Text style={styles.buttonLabel}>{t("restart")}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: deepSkyBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    color: "white",
    fontSize: 54,
  },
  button: {
    flexGrow: 1,
    height: 66,
    borderRadius: 16,
    backgroundColor: deepSkyBlue,
    marginHorizontal: 8,
  },
  closeButton: {
    flexGrow: 1,
    height: 66,
    borderRadius: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: deepSkyBlue,
    marginHorizontal: 8,
  },
  closeButtonLabel: {
    color: deepSkyBlue,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(18),
  },
  buttonLabel: {
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
    color: Colors.BLACK_COLOR,
    lineHeight: verticalScale(25),
    textAlign: "center",
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
  },
});

export default ForceRestartModal;
