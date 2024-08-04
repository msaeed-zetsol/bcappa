import React from 'react';
import {View, Text} from 'native-base';
import {StatusBar} from 'react-native';
import {horizontalScale, verticalScale} from '../../utilities/dimensions';
import Colors, {newColorTheme, wildWatermelon} from '../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import {Fonts, Images} from '../../constants';
import { useTranslation } from "react-i18next";
import AppBar from '../../components/AppBar';

const MyRewardsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.PRIMARY_COLOR}
      />
      <View
        bg={wildWatermelon}
        px={horizontalScale(20)}
        height={verticalScale(300)}
      >
        <AppBar
          name={t("rewards")}
          onPress={navigation.goBack}
          color={Colors.WHITE_COLOR}
        />

        <View
          bg={"WHITE_COLOR"}
          mt={verticalScale(40)}
          borderRadius={10}
          py={verticalScale(20)}
        >
          <View justifyContent={"center"} alignItems={"center"}>
            <Text color={Colors.LIGHT_GREY} fontFamily={Fonts.POPPINS_MEDIUM}>
              {t("current_badge")}
            </Text>
            <View flexDirection={"row"} alignItems={"center"}>
              <Text
                color={Colors.BLACK_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(20)}
                mr={1}
              >
                {t("silver")}
              </Text>
              <Images.Trophy />
            </View>
          </View>
          <View
            mt={verticalScale(15)}
            flexDirection={"row"}
            justifyContent={"space-around"}
            alignItems={"center"}
            px={1}
          >
            <View justifyContent={"center"} alignItems={"center"}>
              <Text
                color={Colors.LIGHT_GREY}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(14)}
              >
                {t("active_goals")}
              </Text>
              <Text
                color={Colors.PRIMARY_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(25)}
              >
                02
              </Text>
            </View>
            <View justifyContent={"center"} alignItems={"center"}>
              <Text
                color={Colors.LIGHT_GREY}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(14)}
              >
                {t("goals_completed")}
              </Text>
              <Text
                color={Colors.PRIMARY_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(25)}
              >
                02
              </Text>
            </View>
            <View justifyContent={"center"} alignItems={"center"}>
              <Text
                color={Colors.LIGHT_GREY}
                fontFamily={Fonts.POPPINS_MEDIUM}
                fontSize={verticalScale(14)}
              >
                {t("badge_earned")}
              </Text>
              <Text
                color={Colors.PRIMARY_COLOR}
                fontFamily={Fonts.POPPINS_SEMI_BOLD}
                fontSize={verticalScale(25)}
              >
                02
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Text
        mx={horizontalScale(20)}
        color={Colors.LIGHT_GREY}
        fontSize={verticalScale(22)}
        fontFamily={Fonts.POPPINS_SEMI_BOLD}
        my={verticalScale(12)}
      >
        {t("all_goals")}
      </Text>
    </View>
  );
};

export default MyRewardsScreen;
