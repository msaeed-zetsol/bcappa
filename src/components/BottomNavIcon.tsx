import { Text, View } from "native-base";
import { Colors } from "../constants";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { StyleSheet } from "react-native";

type BottomNavIconProps = {
  text: string;
  focused: boolean;
  icons: {
    FocusedIcon: any;
    UnfocusedIcon: any;
  };
};

const BottomNavIcon = ({ text, focused, icons }: BottomNavIconProps) => {
  return (
    <View style={style.container}>
      {focused ? (
        <icons.FocusedIcon
          resizeMode="contain"
          width={horizontalScale(35)}
          height={verticalScale(35)}
        />
      ) : (
        <icons.UnfocusedIcon
          resizeMode="contain"
          width={horizontalScale(30)}
          height={verticalScale(30)}
        />
      )}

      <Text
        style={[
          style.text,
          {
            color: focused ? Colors.PRIMARY_COLOR : Colors.GREY,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: verticalScale(13),
    marginTop: verticalScale(5),
    fontWeight: "500",
  },
});

export default BottomNavIcon;
