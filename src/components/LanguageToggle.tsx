import { Text, View } from "native-base";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Fonts } from "../constants";
import { useEffect, useState } from "react";
import i18next from "i18next";
import {
  findLanguageByCode,
  forceUpdateLanguage,
  languages,
} from "../localization/config";

type LanguageToggleProps = {
  onToggle: (code: string) => void;
  style?: StyleProp<ViewStyle>;
};

const LanguageToggle = ({ onToggle: onClick, style }: LanguageToggleProps) => {
  const selectedLanguage = i18next.language;

  return (
    <View style={[style, styles.container]}>
      <ToggleView
        text="Eng"
        isSelected={selectedLanguage === "en"}
        onPress={() => onClick("en")}
        style={{
          borderTopStartRadius: 5,
          borderBottomStartRadius: 5,
        }}
      />
      <ToggleView
        text="اردو"
        isSelected={selectedLanguage === "ur"}
        onPress={() => onClick("ur")}
        style={{
          borderTopEndRadius: 5,
          borderBottomEndRadius: 5,
        }}
      />
    </View>
  );
};

type ToggleViewProps = {
  text: string;
  isSelected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const ToggleView = (props: ToggleViewProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={[
          props.style,
          {
            backgroundColor: props.isSelected ? "#02A7FD" : "#F6F6F6",
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: props.isSelected ? "white" : "#5A5A5C" },
          ]}
        >
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default LanguageToggle;
