import {
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { View, Text, Avatar, Button, Divider } from "native-base";
import { verticalScale, horizontalScale } from "../../utilities/dimensions";
import {
  aliceBlue,
  newColorTheme,
  nobel,
  wildWatermelon,
} from "../../constants/Colors";
import { Fonts, Images } from "../../constants";
import ImagePicker, {
  ImageOrVideo,
  Options,
} from "react-native-image-crop-picker";
import InfoModal from "../../components/InfoModal";
import { modalEnums } from "../../types/Enums";
import {
  CommonActions,
  CompositeScreenProps,
  useFocusEffect,
} from "@react-navigation/native";
import ProfileInformationRow from "../../components/ProfileInformationRow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createFormData,
  getFirstAndLastCharsUppercase,
} from "../../utilities/helper-functions";
import * as Animatable from "react-native-animatable";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useTranslation } from "react-i18next";
import useAxios from "../../hooks/useAxios";
import Personal from "../../assets/svg/Personal.svg";
import FAQ from "../../assets/svg/FAQ.svg";
import Language from "../../assets/svg/Language.svg";
import Logout from "../../assets/svg/Logout.svg";
import Rewards from "../../assets/svg/Rewards.svg";
import Terms from "../../assets/svg/Terms.svg";
import Verification from "../../assets/svg/Verification.svg";
import Settings from "../../assets/svg/Settings.svg";
import PhotoPicker from "../../components/PhotoPicker";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamsList } from "../../navigators/bottom-navigator/BottomNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators/stack-navigator/StackNavigator";

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamsList, "ProfileScreen">,
  NativeStackScreenProps<RootStackParamList>
>;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [photoPickerModal, showPhotoPickerModal] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileResponse>();
  const [profileImage, setProfileImage] = useState<string>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const { t } = useTranslation();

  const avatarName = useMemo(
    () => getFirstAndLastCharsUppercase(userProfile?.fullName || ""),
    [userProfile?.fullName]
  );

  const pickerOptions: Options = useMemo(() => {
    return {
      width: 300,
      height: 400,
      cropping: true,
    };
  }, []);

  const handlePickedImage = (image: ImageOrVideo) => {
    showPhotoPickerModal(false);
    setProfileImage(image.path);
    sendUpdateProfileRequest(image.path, image.mime);
  };

  const [verificationModal, setVerificationModal] = useState({
    verified: true,
    notVerified: false,
  });
  const [isButtonPressed, setButtonPressed] = useState(false);
  const handleCallback = (payload: any) => {
    setButtonPressed(false);
    if (payload.name === modalEnums.ACCOUNT_NOT_VERIFIED) {
      setVerificationModal((prevData) => ({
        ...prevData,
        notVerified: !payload.value,
      }));
      navigation.dispatch(CommonActions.navigate("JazzDostVerification"));
    }
    if (payload.name === "close") {
      setVerificationModal((prevData) => ({
        ...prevData,
        notVerified: !payload.value,
      }));
    }
  };

  const [logoutResponse, logout] = useAxios<MessageResponse>(
    "/auth/logout",
    "post"
  );
  const logoutSocialLogIn = async () => {
    try {
      const data = await GoogleSignin.signOut();
      console.log({ data });
    } catch (err) {
      console.log(err);
    }
  };

  const logoutHandler = () => {
    setLoggingOut(true);
    abortControllerRef.current = logout();
  };

  useEffect(() => {
    if (logoutResponse === null) {
      setLoggingOut(false);
    }

    if (logoutResponse && logoutResponse.message === "Logout Successful") {
      navigateToLoginScreen();
    }
  }, [logoutResponse]);

  const navigateToLoginScreen = async () => {
    await logoutSocialLogIn();
    await AsyncStorage.removeItem("loginUserData");
    navigation.replace("AuthStack", { screen: "LoginScreen" });
  };

  const [profileResponse, updateProfile] = useAxios<ProfileResponse>(
    "/user/profile",
    "put",
    {
      "Request failed": "Invalid request data. Please check your input.",
    }
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const selectImageFromGallery = async () => {
    const result: ImageOrVideo = await ImagePicker.openPicker(pickerOptions);
    handlePickedImage(result);
  };

  const selectImgeFromCamera = async () => {
    const result: ImageOrVideo = await ImagePicker.openCamera(pickerOptions);
    handlePickedImage(result);
  };

  const sendUpdateProfileRequest = async (path: string, mime: string) => {
    setUpdatingProfile(true);
    const data = {
      profileImg: {
        uri: path,
        name: path.split("/")[path.split("/")?.length - 1],
        fileName: path.split("/")[path.split("/")?.length - 1],
        type: mime,
      },
    };

    abortControllerRef.current = updateProfile({
      data: createFormData(data),
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  useEffect(() => {
    if (profileResponse === null) {
      setUpdatingProfile(false);
    }

    if (profileResponse) {
      if (userProfile) {
        userProfile.profileImg = profileResponse.profileImg;
        AsyncStorage.setItem("loginUserData", JSON.stringify(userProfile)).then(
          () => {
            setUpdatingProfile(false);
          }
        );
      }
    }
  }, [profileResponse]);

  const setSavedProfileImage = async () => {
    AsyncStorage.getItem(
      "loginUserData",
      (error?: Error | null, result?: string | null) => {
        if (result) {
          const profile = JSON.parse(result);
          setUserProfile(profile);
          setProfileImage(profile.profileImg);
        } else if (error) {
          console.log(error.message);
        }
      }
    );
  };

  useFocusEffect(
    useCallback(() => {
      setSavedProfileImage();
    }, [])
  );

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />

      <View justifyContent={"center"} alignItems={"center"} mt={5}>
        <Avatar bg="amber.500" source={{ uri: profileImage }} size="xl">
          {avatarName}

          <Avatar.Badge
            p={verticalScale(13)}
            bg={wildWatermelon}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {updatingProfile ? (
              <ActivityIndicator size={"large"} color={wildWatermelon} />
            ) : (
              <TouchableOpacity
                style={{ justifyContent: "center" }}
                onPress={() => showPhotoPickerModal(true)}
              >
                <Images.Camera width={18} height={18} />
              </TouchableOpacity>
            )}
          </Avatar.Badge>
        </Avatar>
      </View>

      <View style={styles.centeredRow}>
        <Text style={styles.fullName} isTruncated={true} numberOfLines={1}>
          {userProfile?.fullName}
        </Text>
        <Images.Reward />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(30) }}
      >
        <Text style={styles.grayText}>{t("general")}</Text>

        <ProfileInformationRow
          heading={t("personal_information")}
          onPress={() => {
            if (userProfile) {
              navigation.navigate("UpdateProfileScreen", {
                profile: userProfile,
              });
            }
          }}
          startIcon={{ Icon: Personal }}
          endIconMode="navigation"
        />
        <Divider backgroundColor={aliceBlue} />

        {/* <ProfileInformationRow
          heading={t("account_verification")}
          onPress={() => {
            if (userProfile?.settings?.isJazzDostVerified) {
              navigation.dispatch(
                CommonActions.navigate("VerifiedAccountDetails")
              );
            } else {
              setVerificationModal((prevData) => ({
                ...prevData,
                notVerified: true,
              }));
            }
          }}
          startIcon={{ Icon: Verification }}
          endIconMode={{
            isVerified: userProfile?.settings?.isJazzDostVerified ?? false,
          }}
        />
        <Divider backgroundColor={aliceBlue} /> */}

        {/* <ProfileInformationRow
          heading={t("my_rewards")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("MyRewards"))
          }
          startIcon={{ Icon: Rewards }}
          endIconMode="navigation"
        />
        <Divider backgroundColor={aliceBlue} /> */}

        <ProfileInformationRow
          heading={t("faq_and_support")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("FaqAndSupport"))
          }
          startIcon={{ Icon: FAQ }}
          endIconMode="navigation"
        />
        <Divider backgroundColor={aliceBlue} />

        <ProfileInformationRow
          heading={t("terms_and_conditions")}
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate("TermsAndConditions", {
                name: "Terms And Condition",
              })
            );
          }}
          startIcon={{ Icon: Terms }}
          endIconMode="navigation"
        />

        <Text style={styles.grayText}>{t("preferences")}</Text>

        <ProfileInformationRow
          heading={t("language")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("Language"))
          }
          startIcon={{ Icon: Language }}
          endIconMode="navigation"
        />
        <Divider backgroundColor={aliceBlue} />

        <ProfileInformationRow
          heading={t("bc_settings")}
          startIcon={{ Icon: Settings }}
          endIconMode="navigation"
        />
        <Divider backgroundColor={aliceBlue} />

        <ProfileInformationRow
          heading={t("log_out")}
          onPress={() => setShowLogoutModal(true)}
          startIcon={{ Icon: Logout }}
          endIconMode="navigation"
        />
      </ScrollView>

      {verificationModal.notVerified && (
        <InfoModal
          message={t("account_not_verified")}
          buttonText={t("verify_now")}
          callback={handleCallback}
          Photo={Images.AccountNotVerified}
          name={modalEnums.ACCOUNT_NOT_VERIFIED}
          isButtonPressed={isButtonPressed}
          show={true}
        />
      )}

      <PhotoPicker
        visible={photoPickerModal}
        onDismiss={() => showPhotoPickerModal(false)}
        onPick={(type) => {
          if (type == "camera") {
            selectImgeFromCamera();
          } else {
            selectImageFromGallery();
          }
        }}
      />

      <Modal
        visible={showLogoutModal}
        statusBarTranslucent
        transparent
        presentationStyle="overFullScreen"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.63)",
            justifyContent: "center",
          }}
        >
          <Animatable.View
            animation={"bounceIn"}
            style={{
              marginHorizontal: horizontalScale(20),
              backgroundColor: "white",
              borderRadius: 15,
              paddingVertical: verticalScale(20),
            }}
          >
            <View justifyContent={"center"} alignItems={"center"}>
              <Images.LogoutImage />
              <Text
                mt={verticalScale(20)}
                color={"BLACK_COLOR"}
                fontSize={"2xl"}
                letterSpacing={1}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
              >
                {t("are_you_sure")}
              </Text>
              <Text
                color={"GREY"}
                fontSize={"sm"}
                fontFamily={Fonts.POPPINS_MEDIUM}
              >
                {t("you_want_sign_out")}
              </Text>
            </View>
            <View mt={5} flexDirection={"row"} justifyContent={"center"}>
              <Button
                variant="solid"
                _text={{
                  color: "BLACK_COLOR",
                  fontFamily: Fonts.POPPINS_SEMI_BOLD,
                }}
                backgroundColor={"#D3D3D3"}
                size={"md"}
                px={"8"}
                mr={2}
                borderRadius={10}
                onPress={() => {
                  setShowLogoutModal(false);
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                isLoading={isLoggingOut}
                variant="solid"
                _text={{
                  color: "WHITE_COLOR",
                  fontFamily: Fonts.POPPINS_SEMI_BOLD,
                }}
                _loading={{
                  _text: {
                    color: "BLACK_COLOR",
                    fontFamily: Fonts.POPPINS_MEDIUM,
                  },
                }}
                _spinner={{
                  color: "BLACK_COLOR",
                }}
                _pressed={{
                  backgroundColor: "DISABLED_COLOR",
                }}
                spinnerPlacement="end"
                backgroundColor={"PRIMARY_COLOR"}
                size={"lg"}
                px={"8"}
                borderRadius={10}
                isPressed={isLoggingOut}
                onPress={logoutHandler}
              >
                {t("log_out")}
              </Button>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: verticalScale(15),
  },
  fullName: {
    marginTop: 2,
    fontSize: verticalScale(20),
    color: "#06202E",
    letterSpacing: 0.3,
    fontFamily: Fonts.POPPINS_BOLD,
    maxWidth: horizontalScale(250),
    textAlign: "center",
  },
  centeredRow: {
    marginTop: verticalScale(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  grayText: {
    marginStart: horizontalScale(22),
    marginTop: verticalScale(16),
    color: nobel,
    fontFamily: Fonts.POPPINS_REGULAR,
    fontSize: verticalScale(15),
  },
});

export default ProfileScreen;
