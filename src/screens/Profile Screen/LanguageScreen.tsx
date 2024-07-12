import React, { useMemo, useState } from "react";
import { View } from "native-base";
import { StatusBar, StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import { newColorTheme } from "../../constants/Colors";
import Heading from "../../components/Heading";
import { useNavigation } from "@react-navigation/native";
import i18next, {
  findLanguageByCode,
  forceUpdateLanguage,
  languages,
} from "../../localization/config";
import { t } from "i18next";
import LanguageCheckable from "../../components/LanguageCheckable";
import ForceRestartModal from "../../components/ForceRestartModal";

const LanguageScreen = () => {
  const navigation = useNavigation();
  const selectedLanguage = useMemo(
    () => findLanguageByCode(i18next.language),
    [i18next.language]
  );
  const [lng, setLng] = useState(selectedLanguage);
  const [showRestartModal, setShowRestartModal] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />

      <Heading name={t("select_language")} onPress={navigation.goBack} />

      <View style={{ marginTop: verticalScale(50) }}>
        {languages.map((it) => {
          return (
            <LanguageCheckable
              Icon={it.icon}
              text={it.name}
              isChecked={it === lng}
              onCheck={() => {
                if (it !== lng) {
                  setLng(it);
                  setShowRestartModal(true);
                }
              }}
            />
          );
        })}
      </View>

      <ForceRestartModal
        visible={showRestartModal}
        onDismiss={() => {
          setLng(selectedLanguage);
          setShowRestartModal(false);
        }}
        onRestart={() => forceUpdateLanguage(lng)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(15),
    paddingHorizontal: horizontalScale(22),
    backgroundColor: "white",
  },
});

export default LanguageScreen;
