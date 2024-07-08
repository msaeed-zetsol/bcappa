import { I18nManager, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "native-base";
import React from "react";
import { Fonts, Images } from "../constants";
import { verticalScale } from "../utilities/Dimensions";

type EndIconMode =
  | "navigation"
  | {
      isVerified: boolean;
    };

// bad implementation - we should not use 'any' type
type StartIcon = {
  Icon: any;
};

type ProfileInformationRowProps = {
  heading: string;
  startIcon: StartIcon;
  endIconMode: EndIconMode;
  onPress?: () => void;
};

const ProfileInformationRow = ({
  heading,
  startIcon,
  endIconMode,
  onPress,
}: ProfileInformationRowProps) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.innerRow}>
        <startIcon.Icon height={40} width={40} />
        <Text style={styles.text}>{heading}</Text>
      </View>
      {endIconMode === "navigation" ? (
        <Images.ArrowRight
          style={{
            transform: [{ rotateY: I18nManager.isRTL ? "180deg" : "0deg" }],
          }}
        />
      ) : endIconMode.isVerified ? (
        <Images.Verified />
      ) : (
        <Images.NotVerified style={styles.unverifiedIcon} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(25),
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginStart: 16,
    color: "#03110A",
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(18),
  },
  unverifiedIcon: {
    marginEnd: 8,
  },
});

export default ProfileInformationRow;
