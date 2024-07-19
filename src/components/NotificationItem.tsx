import { Text } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { horizontalScale, verticalScale } from "../utilities/Dimensions";
import { Fonts } from "../constants";
import { StyleSheet } from "react-native";

type NotificationItemProps = {
  notification: Notification;
  index: number;
};

const NotificationItem = ({ notification, index }: NotificationItemProps) => {
  return (
    <TouchableOpacity key={index} style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.description}>{notification.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginTop: verticalScale(25),
    marginHorizontal: horizontalScale(5),
  },
  title: {
    color: "#090A0A",
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(15),
    fontWeight: 700,
  },
  description: {
    color: "#777777",
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(14),
  },
});

export default NotificationItem;
