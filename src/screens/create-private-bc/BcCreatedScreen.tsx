import { Image, ScrollView, Text, Toast, View } from "native-base";
import {
  ActivityIndicator,
  Share,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
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
import { RootStackParamList } from "../../navigators/stack-navigator/StackNavigator";
import * as Clipboard from "expo-clipboard";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { useEffect, useRef, useState } from "react";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { useAppDispatch } from "../../hooks/hooks";
import { setErrors } from "../../redux/user/userSlice";
import PrimaryButton from "../../components/PrimaryButton";
import { updateRefreshState } from "../../redux/refresh/refreshSlice";

type BcCreatedProps = NativeStackScreenProps<
  RootStackParamList,
  "BcCreatedScreen"
>;

const BcCreatedScreen = ({ route, navigation }: BcCreatedProps) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

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
      dispatch(
        setErrors({
          message: "Please grant media permissions from settings",
          value: true,
        })
      );
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
      dispatch(
        setErrors({
          message: "Unable to save QR Code",
          value: true,
        })
      );
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
      <PrimaryButton
        text="Back"
        isDisabled={false}
        isLoading={false}
        onClick={() => {
          dispatch(
            updateRefreshState({
              home: true,
              myBcs: true,
            })
          );
          navigation.goBack();
        }}
        props={{ width: "85%", mt: verticalScale(16) }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: verticalScale(36),
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
});

export default BcCreatedScreen;
