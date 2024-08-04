import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Text, View } from "native-base";
import { Fonts, Images } from "../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { blackPearl, deepSkyBlue, smoky } from "../constants/Colors";
import { useTranslation } from "react-i18next";

type MemberListItemProps = {
  member: Member;
  index: number;
  isBalloting: boolean;
  onPressIn: () => void;
  onDelete: (member: Member) => void;
  style?: StyleProp<ViewStyle>;
};

const MemberListItem = ({
  member,
  index,
  isBalloting,
  onPressIn,
  onDelete,
  style,
}: MemberListItemProps) => {
  const { t } = useTranslation();
  return (
    <View
      key={member.openingPrecedence}
      style={[styles.row, style, { marginTop: verticalScale(10) }]}
    >
      {!isBalloting ? (
        <TouchableOpacity
          onPressIn={onPressIn}
          style={styles.touchableContainer}
        >
          <Images.DragIcon />
        </TouchableOpacity>
      ) : (
        <View style={{ paddingStart: horizontalScale(20) }}></View>
      )}

      <View style={styles.contentColumn}>
        <View style={styles.fullNameRow}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.name, { color: blackPearl }]}>
              {member.fullName}
            </Text>
            <Text style={styles.precedence}> ({index + 1})</Text>
          </View>
        </View>

        <View style={{ flexDirection: "column", marginTop: 8 }}>
          <Text style={[styles.text, { color: blackPearl }]}>
            {t("phone_captialized")}
          </Text>
          <Text style={[styles.text, { color: smoky, marginTop: 1 }]}>
            {member.phone}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{ marginEnd: 16 }}
        onPress={() => onDelete(member)}
      >
        <MaterialIcons name="close" size={25} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.1)",
  },
  contentColumn: {
    flexDirection: "column",
    flex: 1,
    paddingVertical: 16,
  },
  fullNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 0.5,
  },
  name: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: 19,
  },
  text: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: 14,
  },
  precedence: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: 16,
    color: deepSkyBlue,
  },
  touchableContainer: {
    height: "100%",
    width: "auto",
    paddingStart: 10,
    paddingEnd: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MemberListItem;
