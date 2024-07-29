import { Text, View } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Fonts, Images } from "../constants";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { StyleSheet } from "react-native";

type LanguageCheckableProps = {
  text: string;
  isChecked: boolean;
  onCheck: () => void;
  Icon: any;
};

const LanguageCheckable = ({
  text,
  isChecked,
  onCheck,
  Icon,
}: LanguageCheckableProps) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={onCheck}>
      <View style={styles.btnStyle}>
        <Icon height={verticalScale(40)} width={horizontalScale(40)} />
        <Text style={styles.text}>{text}</Text>
      </View>
      {isChecked && <Images.Tick />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  btnStyle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    marginLeft: horizontalScale(15),
    fontSize: verticalScale(18),
  },
});

export default LanguageCheckable;
