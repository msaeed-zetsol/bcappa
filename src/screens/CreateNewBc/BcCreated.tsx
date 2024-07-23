import { Button, Image, ScrollView, Text, Toast, View } from "native-base";
import {
  ActivityIndicator,
  Share,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import {
  deepSkyBlue,
  ghostWhite,
  newColorTheme,
  smoky,
  veryLightGrey,
  whiteSmoke,
  zambezi,
} from "../../constants/Colors";
import { Fonts } from "../../constants";
import QRCode from "react-native-qrcode-svg";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators/StackNavigator/StackNavigator";
import { StackActions } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { useEffect, useRef, useState } from "react";
import dynamicLinks from "@react-native-firebase/dynamic-links";

type BcCreatedProps = NativeStackScreenProps<RootStackParamList, "BcCreated">;

const BcCreated = ({ route, navigation }: BcCreatedProps) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buildLink();
  }, []);

  const buildLink = async () => {
    const shortLink = await dynamicLinks().buildShortLink(
      {
        link: `https://invertase.io/offer?id=${route.params.bcId}`,
        domainUriPrefix: "https://bcappa.page.link",
        analytics: {
          campaign: "banner",
        },
        android: {
          packageName: "com.bcappa",
        },
      },
      dynamicLinks.ShortLinkType.DEFAULT
    );
    setLink(shortLink);
    setLoading(false);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(link);
  };

  const shareLink = async () => {
    await Share.share({ message: link });
  };

  const checkMediaPermissions = async () => {
    if (status === null || status.canAskAgain) {
      const response = await requestPermission();
      if (response.granted) {
        onSaveImageAsync();
      }
    } else if (status.granted) {
      onSaveImageAsync();
    } else {
      Toast.show({ title: "Please grant media permissions from settings." });
    }
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, { quality: 1 });
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        Toast.show({ title: "Saved!" });
      }
    } catch (e) {
      Toast.show({ title: "Unable to save QR Code" });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <StatusBar
        backgroundColor={newColorTheme.WHITE_COLOR}
        barStyle={"dark-content"}
      />
      <View style={styles.congratulationsContainer}>
        <Image
          source={require("../../assets/images/congratulations.png")}
          size={verticalScale(84)}
        />
      </View>
      <Text style={styles.congratulationsText}>Congratulations!</Text>
      <Text style={styles.text}>Your BC has Been Created</Text>
      {loading ? (
        <>
          <ActivityIndicator
            style={{ marginTop: 16 }}
            size={36}
            color={deepSkyBlue}
          />
        </>
      ) : (
        <>
          <View style={styles.linkContainer}>
            <Text style={styles.linkPlaceholder}>Link</Text>
            <Text
              style={styles.linkText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {link}
            </Text>
            <TouchableOpacity style={styles.linkIcon} onPress={copyToClipboard}>
              <Image
                source={require("../../assets/images/copy.png")}
                size={verticalScale(24)}
                color={smoky}
                alt="copy"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.qrCode} ref={imageRef} collapsable={false}>
            <QRCode size={235} value={link} />
          </View>
          <View style={styles.iconsRow}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={checkMediaPermissions}
            >
              <View style={styles.icon}>
                <Image
                  source={require("../../assets/images/save.png")}
                  alt="save"
                />
              </View>
              <Text style={styles.iconText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={shareLink}>
              <View style={styles.icon}>
                <Image
                  source={require("../../assets/images/share.png")}
                  alt="share"
                />
              </View>
              <Text style={styles.iconText}>Share</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <Button
        style={styles.button}
        _pressed={{ backgroundColor: "DISABLED_COLOR" }}
        backgroundColor={deepSkyBlue}
        onPress={() => {
          navigation.dispatch(
            StackActions.replace("BottomNavigator", {
              screen: "HomeScreen",
            })
          );
        }}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flex: 1,
    backgroundColor: "white",
  },
  congratulationsContainer: {
    width: verticalScale(156),
    height: verticalScale(156),
    backgroundColor: whiteSmoke,
    borderRadius: 156,
    justifyContent: "center",
    alignItems: "center",
  },
  congratulationsText: {
    marginTop: 16,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontWeight: 600,
    fontSize: 20,
  },
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    fontWeight: 400,
    fontSize: 15,
    color: zambezi,
  },
  linkContainer: {
    marginTop: verticalScale(33),
    width: "85%",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: veryLightGrey,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
  },
  linkPlaceholder: {
    position: "absolute",
    top: -13,
    start: 7,
    backgroundColor: "white",
    paddingHorizontal: horizontalScale(8),
  },
  linkText: {
    width: "87%",
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontWeight: 500,
    fontSize: 14,
  },
  linkIcon: {
    marginHorizontal: 16,
  },
  qrCode: {
    marginTop: 33,
  },
  iconsRow: {
    marginTop: 30,
    flexDirection: "row",
    width: "40%",
    justifyContent: "space-between",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 54,
    height: 54,
    backgroundColor: ghostWhite,
    borderRadius: 10,
  },
  iconText: {
    marginTop: 8,
    fontFamily: Fonts.POPPINS_REGULAR,
    fontSize: 15,
  },
  button: {
    marginTop: 36,
    marginBottom: 36,
    paddingVertical: 25,
    width: "85%",
    borderRadius: 15,
    height: 66,
  },
  buttonText: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: 16,
    color: "white",
  },
});

export default BcCreated;
