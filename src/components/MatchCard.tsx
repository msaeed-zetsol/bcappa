import { Image, Text, View } from "native-base";
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Fonts } from "../constants";
import { verticalScale } from "../utilities/Dimensions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { deepSkyBlue, wildWatermelon } from "../constants/Colors";

type MatchCardProps = {
  user: User;
  isCancellable: boolean;
  onAdd: () => void;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
};

const MatchCard = ({
  user,
  isCancellable,
  onAdd,
  onCancel,
  style,
}: MatchCardProps) => {
  return (
    <View style={[styles.card, style]}>
      <ImageBackground
        source={{
          uri:
            user.profileImg ??
            "https://res.cloudinary.com/didbvjb3m/image/upload/v1697800339/uqn2rc2plzmmzfnneqfo.png",
        }}
        resizeMode="cover"
        style={styles.ImageBackground}
      >
        <View style={styles.imageText}>
          <Text
            color={"WHITE_COLOR"}
            fontFamily={Fonts.POPPINS_BOLD}
            fontSize={verticalScale(35)}
            lineHeight={38}
          >
            {user.fullName}
          </Text>
          <Text
            mt={1}
            color={"WHITE_COLOR"}
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            fontSize={verticalScale(18)}
          >
            Rs: {user.monthlyAmount}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.cardBottom}>
        {isCancellable && (
          <TouchableOpacity
            onPress={onCancel}
            style={[styles.iconContainer, { borderColor: wildWatermelon }]}
          >
            <Image
              source={require("../assets/images/close.png")}
              size={verticalScale(24)}
              alt="close"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onAdd}
          style={[
            styles.iconContainer,
            { borderColor: deepSkyBlue },
            isCancellable && { marginStart: 36 },
          ]}
        >
          <Image
            style={{ marginStart: 4 }}
            source={require("../assets/images/group.png")}
            size={30}
            alt="group"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const cardHeight = 480;
const w80 = cardHeight * 0.8;
const w20 = cardHeight - w80;
const styles = StyleSheet.create({
  card: {
    height: cardHeight,
    backgroundColor: "#fff",
    elevation: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ImageBackground: {
    height: w80,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageText: {
    height: "100%",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardBottom: {
    height: w20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  iconContainer: {
    width: 67,
    height: 67,
    borderRadius: 67,
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MatchCard;
