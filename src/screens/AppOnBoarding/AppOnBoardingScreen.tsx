import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Image, StatusBar } from "react-native";
import { OnboardFlow } from "react-native-onboard";
import { Colors } from "../../constants";
import { useTranslation } from "react-i18next";

export default function OnBoardScreen() {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} backgroundColor="white" />
      <OnboardFlow
        style={{ backgroundColor: "white" }}
        pages={[
          {
            title: t("onboarding_first_title"),
            subtitle: t("onboarding_first_description"),
            imageUri: Image.resolveAssetSource(
              require("../../assets/OnBoarding1.png")
            ).uri,
          },
          {
            title: t("onboarding_second_title"),
            subtitle: t("onboarding_second_description"),
            imageUri: Image.resolveAssetSource(
              require("../../assets/OnBoarding2.png")
            ).uri,
          },
          {
            title: t("onboarding_third_title"),
            subtitle: t("onboarding_third_description"),
            imageUri: Image.resolveAssetSource(
              require("../../assets/OnBoarding3.png")
            ).uri,
          },
        ]}
        type="inline" // Change to either 'fullscreen', 'bottom-sheet', or 'inline'
        autoPlay={true}
        onDone={() => {
          AsyncStorage.setItem("onboardingComplete", "true").then(() => {
            navigation.replace("LoginScreen");
          });
        }}
        paginationColor={Colors.DISABLED_COLOR}
        paginationSelectedColor={Colors.PRIMARY_COLOR}
        primaryColor={Colors.PRIMARY_COLOR}
        primaryButtonTextStyle={{
          fontSize: 16,
          backgroundColor: Colors.PRIMARY_COLOR,
          borderRadius: 16,
        }}
        titleStyle={{
          fontSize: 32,
          lineHeight: 50,
        }}
        subtitleStyle={{
          fontSize: 18,
          lineHeight: 24,
        }}
        textStyle={{
          fontSize: 16,
          lineHeight: 24,
        }}
      />
    </View>
  );
}
