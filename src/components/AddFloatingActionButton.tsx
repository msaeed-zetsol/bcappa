import { Image } from "native-base";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { StyleSheet, TouchableOpacity } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { wildWatermelon } from "../constants/Colors";

type AddFloatingActionButtonProps = {
  onClick: () => void;
};

const AddFloatingActionButton = ({ onClick }: AddFloatingActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <Image
        source={require("../assets/images/add.png")}
        size={verticalScale(24)}
        alt="create bc"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: verticalScale(64),
    height: verticalScale(64),
    backgroundColor: wildWatermelon,
    position: "absolute",
    bottom: verticalScale(20),
    right: horizontalScale(15),
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default AddFloatingActionButton;
