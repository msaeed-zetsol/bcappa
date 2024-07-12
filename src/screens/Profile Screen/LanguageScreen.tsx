import React, { useState } from "react";
import { View, Text } from "native-base";
import { StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../utilities/Dimensions";
import { newColorTheme } from "../../constants/Colors";
import Heading from "../../components/Heading";
import { useNavigation } from "@react-navigation/native";
import { Images, Fonts } from "../../constants";
import i18next, { forceUpdateLanguage } from "../../localization/config";
import { t } from "i18next";

const LanguageScreen = () => {
  const navigation = useNavigation();
  const [language, setLanguage] = useState(i18next.language);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <Heading name={t("select_language")} onPress={navigation.goBack} />
      <View style={{ marginTop: verticalScale(50) }}>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => {
            setLanguage("en");
            forceUpdateLanguage("en");
          }}
        >
          <View style={styles.btnStyle}>
            <Images.English
              height={verticalScale(40)}
              width={horizontalScale(40)}
            />
            <Text
              style={[
                styles.text,
                {
                  fontSize: verticalScale(18),
                },
              ]}
            >
              English
            </Text>
          </View>
          {language === "en" && <Images.Tick />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setLanguage("ur");
            forceUpdateLanguage("ur");
          }}
          style={styles.btnContainer}
        >
          <View style={styles.btnStyle}>
            <Images.Urdu
              height={verticalScale(40)}
              width={horizontalScale(40)}
            />
            <Text style={[styles.text, { fontSize: verticalScale(20) }]}>
              اردو
            </Text>
          </View>
          {language === "ur" && <Images.Tick />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(15),
    paddingHorizontal: horizontalScale(22),
    backgroundColor: "BACKGROUND_COLOR",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  btnStyle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontFamily: Fonts.POPPINS_REGULAR,
    marginLeft: horizontalScale(15),
  },
});
