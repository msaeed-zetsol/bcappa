import { Text, View } from "native-base";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Fonts } from "../constants";
import { useState } from "react";

type ToggleValue = "left" | "right";

type ValueToggleProps = {
  leftText: string;
  rightText: string;
  initial: ToggleValue;
  onToggle: (value: ToggleValue) => void;
  isDisabled: boolean;
  style?: StyleProp<ViewStyle>;
};

const ValueToggle = ({
  leftText,
  rightText,
  initial,
  onToggle,
  isDisabled,
  style,
}: ValueToggleProps) => {
  const [selected, setSelected] = useState<ToggleValue>(initial);
  return (
    <View style={[style, styles.container]}>
      <ToggleView
        isDisabled={isDisabled}
        text={leftText}
        isSelected={selected === "left"}
        onPress={() => {
          setSelected("left");
          onToggle("left");
        }}
        style={{
          borderTopStartRadius: 5,
          borderBottomStartRadius: 5,
        }}
      />
      <ToggleView
        isDisabled={isDisabled}
        text={rightText}
        isSelected={selected === "right"}
        onPress={() => {
          setSelected("right");
          onToggle("right");
        }}
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
  isDisabled: boolean;
  style?: StyleProp<ViewStyle>;
};

const ToggleView = (props: ToggleViewProps) => {
  return (
    <TouchableOpacity disabled={props.isDisabled} onPress={props.onPress}>
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

export default ValueToggle;
