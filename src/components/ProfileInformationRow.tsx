import { I18nManager, Pressable, StyleSheet } from "react-native";
import { View, Text } from "native-base";
import React from "react";
import { Fonts, Images } from "../constants";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { aliceBlue } from "../constants/Colors";

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
  startIcon?: StartIcon;
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
    <Pressable
      android_ripple={{
        color: "#cee4f0",
      }}
      style={styles.row}
      onPress={onPress}
    >
      <View style={styles.innerRow}>
        {startIcon && (
          <View style={styles.startIconContainer}>
            <startIcon.Icon height={20} width={20} />
          </View>
        )}
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(22),
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginStart: 12,
    color: "#03110A",
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(17),
  },
  unverifiedIcon: {
    marginEnd: 8,
  },
  startIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: aliceBlue,
    borderRadius: 32,
    padding: 8,
  },
});

export default ProfileInformationRow;
