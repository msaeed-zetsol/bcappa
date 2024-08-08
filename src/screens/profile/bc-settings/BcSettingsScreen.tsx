import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppBar from "../../../components/AppBar";
import { CommonActions, useNavigation } from "@react-navigation/native";
import TextFieldComponent from "../../../components/TextFieldComponent";
import { verticalScale } from "../../../utilities/dimensions";
import { Fonts } from "../../../constants";
import { useTranslation } from "react-i18next";
import useAxios from "../../../hooks/useAxios";
import { removeEmptyProperties } from "../../../utilities/helper-functions";
import { Button } from "native-base";

type PersonalData = {
  monthlyAmount: number;
  bcAmount: number;
};

const BcSettings = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [personalData, setPersonalData] = useState<any>({
    bcAmount: 0,
  });

  const [data, start] = useAxios<PersonalData>("/user/profile", "get", {
    "Request failed": "Invalid request data. Please check your input.",
  });

  const [saveData, saveStart] = useAxios("/user/profile", "put", {
    "Request failed": "Invalid request data. Please check your input.",
    "Something went wrong.": "Something went wrong. Please try again later.",
  });

  const getPersonalData = async () => {
    try {
      start();
    } catch (error) {
      console.error("Error fetching personal data:", error);
    }
  };

  useEffect(() => {
    if (data) {
      setPersonalData({
        bcAmount: data?.monthlyAmount || 0,
      });
    }
  }, [data]);

  useEffect(() => {
    getPersonalData();
  }, []);

  const saveDetailsHandler = async () => {
    setIsLoading(true);
    const data = {
      monthlyAmount: +personalData.bcAmount || 0,
    };

    removeEmptyProperties(data);

    try {
      await saveStart({ data });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar
        name={t("Bc Settings")}
        onPress={() =>
          navigation.dispatch(CommonActions.navigate("ProfileScreen"))
        }
      />
      <View style={{ paddingTop: 40 }}>
        <TextFieldComponent
          placeholder={t("bc_amount")}
          value={
            personalData?.bcAmount === null
              ? 0
              : personalData?.bcAmount?.toString()
          }
          onChange={(txt) => {
            setPersonalData({
              ...personalData,
              bcAmount: txt,
            });
          }}
          keyboardType={"number-pad"}
        />
        <Text style={{ fontFamily: Fonts.POPPINS_SEMI_BOLD, marginTop: 3 }}>
          {t("amount_used_match_bcs")}
        </Text>
      </View>
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
        mt={verticalScale(50)}
        p={"4"}
        borderRadius={16}
        isPressed={isLoading}
        onPress={saveDetailsHandler}
      >
        {t("save")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default BcSettings;
