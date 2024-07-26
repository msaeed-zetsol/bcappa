import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState, useCallback } from "react";
import { View, Text, Avatar, Button, Icon } from "native-base";
import { verticalScale, horizontalScale } from "../../utilities/Dimensions";
import { newColorTheme, wildWatermelon } from "../../constants/Colors";
import { Fonts, Images } from "../../constants";
import ImagePicker from "react-native-image-crop-picker";
import InfoModal from "../../components/InfoModal";
import { modalEnums } from "../../lookups/Enums";
import {
  CommonActions,
  StackActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import ProfileInformationRow from "../../components/ProfileInformationRow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profile } from "../../interface/Interface";
import {
  apimiddleWare,
  createFormData,
  getFirstAndLastCharsUppercase,
} from "../../utilities/HelperFunctions";
import { Content_Type } from "../../constants/Base_Url";
import { useDispatch } from "react-redux";
import * as Animatable from "react-native-animatable";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useTranslation } from "react-i18next";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch: any = useDispatch();
  const [imageModal, setImageModal] = useState(false);
  const [isButtonPressed, setButtonPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<Profile>();
  const AvatarName = getFirstAndLastCharsUppercase(userInfo?.fullName || "");
  const { t } = useTranslation();

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
  );

  const [verificationModal, setVerificationModal] = useState({
    verified: true,
    notVerified: false,
  });
  const [logoutModal, setLogoutModal] = useState(false);
  const handleCallback = (payload: any) => {
    console.log({ payload });
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

    //verified logic
    // if(payload.name===modalEnums.){
    //   setVerificationModal(prevData => ({
    //     ...prevData,
    //     notVerified: !payload.value,
    //   }));

    // }
  };
  const logoutSocialLogIn = async () => {
    try {
      const data = await GoogleSignin.signOut();
      console.log({ data });
    } catch (err) {
      console.log(err);
    }
  };

  const logoutHandler = async () => {
    setIsLoading(true);
    await logoutSocialLogIn();
    await AsyncStorage.removeItem("loginUserData");
    navigation.dispatch(
      StackActions.replace("AuthStack", {
        screen: "LoginScreen",
      })
    );
  };

  const SelectImageFromGallery = async () => {
    await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image: any) => {
      console.log(image);
      setProfileImage(image.path);
      setImageModal(false);
      setImage(image);
    });
  };

  const selectImgeFromCamera = async () => {
    await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async (image: any) => {
      console.log(image);
      setProfileImage(image.path);
      setImageModal(false);
      await setImage(image);
    });
  };

  const setImage = async (img: any) => {
    const data = {
      profileImg: {
        uri: (img as any).path,
        name: (img as any).path?.split("/")[
          (img as any).path?.split("/")?.length - 1
        ],
        fileName: (img as any)?.path.split("/")[
          (img as any)?.path.split("/")?.length - 1
        ],
        type: (img as any).mime,
      },
    };

    console.log({ data: data.profileImg });

    const response = await apimiddleWare({
      url: "/user/profile",
      method: "put",
      data: createFormData(data),
      contentType: Content_Type.FORM_DATA,
      reduxDispatch: dispatch,
      navigation: navigation,
    });

    console.log({ response });

    if (response) {
      setProfileImage(data.profileImg.uri);
      const getItems: any = await AsyncStorage.getItem("loginUserData");
      const parsedItem: any = await JSON.parse(getItems);
      parsedItem.profileImg = data.profileImg.uri;
      const stringifyResponse = await JSON.stringify(parsedItem);
      await AsyncStorage.setItem("loginUserData", stringifyResponse);
    }
  };

  const getData = async () => {
    const getUserData: any = await AsyncStorage.getItem("loginUserData");
    const userData = await JSON.parse(getUserData);
    setUserInfo(userData);
    setProfileImage(userData.profileImg);
    console.log({ userData });
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return (
    <View
      flex={1}
      bg={"BACKGROUND_COLOR"}
      pt={verticalScale(15)}
      px={horizontalScale(22)}
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <View justifyContent={"center"} alignItems={"center"} mt={5}>
        <Avatar
          bg="amber.500"
          source={{
            uri: profileImage,
          }}
          size="xl"
        >
          {AvatarName}
          <Avatar.Badge
            p={verticalScale(13)}
            bg={wildWatermelon}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => {
                setImageModal(true);
              }}
            >
              <Images.Camera width={18} height={18} />
            </TouchableOpacity>
          </Avatar.Badge>
        </Avatar>
      </View>
      <View
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text
          mt={2}
          fontSize={verticalScale(20)}
          color={"#06202E"}
          letterSpacing={0.3}
          fontFamily={Fonts.POPPINS_BOLD}
          isTruncated={true}
          numberOfLines={1}
          maxWidth={horizontalScale(250)}
          textAlign="center"
        >
          {userInfo?.fullName}
        </Text>
        <Images.Reward />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(15) }}
      >
        <Text
          mt={5}
          color={"GREY"}
          fontFamily={Fonts.POPPINS_REGULAR}
          fontSize={verticalScale(15)}
        >
          {t("general")}
        </Text>

        <ProfileInformationRow
          heading={t("personal_information")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("PersonalInformation"))
          }
          startIcon={{ Icon: Images.Profiles }}
          endIconMode="navigation"
        />

        <ProfileInformationRow
          heading={t("account_verification")}
          onPress={() => {
            if (userInfo?.settings?.isJazzDostVerified) {
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
          startIcon={{ Icon: Images.PaymentInfo }}
          endIconMode={{
            isVerified: userInfo?.settings?.isJazzDostVerified ?? false,
          }}
        />

        <ProfileInformationRow
          heading={t("my_rewards")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("MyRewards"))
          }
          startIcon={{ Icon: Images.Faq }}
          endIconMode="navigation"
        />

        <ProfileInformationRow
          heading={t("faq_and_support")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("FaqAndSupport"))
          }
          startIcon={{ Icon: Images.Faq }}
          endIconMode="navigation"
        />

        <ProfileInformationRow
          heading={t("terms_and_conditions")}
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate("TermsAndConditions", {
                name: "Terms And Condition",
              })
            );
          }}
          startIcon={{ Icon: Images.Faq }}
          endIconMode="navigation"
        />

        <Text
          mt={5}
          color={"GREY"}
          fontFamily={Fonts.POPPINS_REGULAR}
          fontSize={verticalScale(15)}
        >
          {t("preferences")}
        </Text>

        <ProfileInformationRow
          heading={t("language")}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate("Language"))
          }
          startIcon={{ Icon: Images.Language }}
          endIconMode="navigation"
        />

        <ProfileInformationRow
          heading={t("bc_settings")}
          startIcon={{ Icon: Images.Settings }}
          endIconMode="navigation"
        />

        <ProfileInformationRow
          heading={t("log_out")}
          onPress={() => setLogoutModal(true)}
          startIcon={{ Icon: Images.Logout }}
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
      <Modal visible={imageModal} transparent={true} animationType="slide">
        <View flex={1} bg={"rgba(0, 0, 0, 0.63)"} justifyContent={"flex-end"}>
          <StatusBar
            backgroundColor={"rgba(0, 0, 0, 0.63)"}
            barStyle={"dark-content"}
          />
          <View
            mx={horizontalScale(20)}
            bg={"WHITE_COLOR"}
            borderRadius={15}
            mb={verticalScale(15)}
          >
            <TouchableOpacity
              onPress={() => {
                SelectImageFromGallery();
              }}
              activeOpacity={0.8}
              style={{
                borderColor: "DISABLED_COLOR",
                borderBottomWidth: 0.5,
                padding: 20,
              }}
            >
              <Text
                textAlign="center"
                color={"PRIMARY_COLOR"}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(18)}
              >
                {t("photo_gallery")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                selectImgeFromCamera();
              }}
              activeOpacity={0.5}
              style={{
                padding: 20,
              }}
            >
              <Text
                textAlign="center"
                color={"PRIMARY_COLOR"}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(18)}
              >
                {t("camera")}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setImageModal(false);
            }}
            style={{
              borderRadius: 15,
              padding: 20,
              backgroundColor: "white",
              marginHorizontal: horizontalScale(20),
              marginBottom: verticalScale(15),
            }}
          >
            <Text
              textAlign="center"
              color={"PRIMARY_COLOR"}
              fontFamily={Fonts.POPPINS_MEDIUM}
              fontSize={verticalScale(18)}
            >
              {t("cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={logoutModal} transparent={true}>
        <Animatable.View
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
                  setLogoutModal(false);
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                isLoading={isLoading}
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
                isPressed={isLoading}
                onPress={logoutHandler}
              >
                {t("log_out")}
              </Button>
            </View>
          </Animatable.View>
        </Animatable.View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  contentStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(25),
    alignItems: "center",
  },
});
