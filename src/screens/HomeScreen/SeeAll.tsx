import {StyleSheet, StatusBar, FlatList, ActivityIndicator} from 'react-native';
import {View, Text, Avatar, Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import {newColorTheme} from '../../constants/Colors';
import Heading from '../../components/Heading';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import {useRoute, useNavigation} from '@react-navigation/native';
import {apimiddleWare} from '../../utilities/HelperFunctions';
import {Fonts, Colors} from '../../constants';
import { useTranslation } from "react-i18next";

const SeeAll = () => {
  const [allData, setAllData] = useState<any>([]);
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const { name, api, btn } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const getData = async () => {
    setIsLoading(true);
    const response = await apimiddleWare({
      url: api,
      method: "get",
    });
    if (response) {
      setAllData(response);
      setIsLoading(false);
    }
  };
  const join = (id: any) => {
    navigation.navigate("BcDetailsScreen", {
      item: id,
      deeplink: false,
    });
  };
  const details = (id: any) => {
    navigation.navigate("BcDetailsScreen", {
      item: id,
      deeplink: false,
    });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <View flex={1} bg={"BACKGROUND_COLOR"}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />
      <View px={horizontalScale(20)}>
        <Heading name={name} navigation={navigation} />
      </View>
      {!isLoading ? (
        <FlatList
          contentContainerStyle={{
            paddingVertical: verticalScale(2),
          }}
          data={allData}
          renderItem={({ item, index }) => {
            return (
              <View
                mx={5}
                bg={"WHITE_COLOR"}
                borderRadius={20}
                height={verticalScale(170)}
                p={5}
                mt={8}
                style={{
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: {
                    width: 10,
                    height: 2,
                  },
                  shadowRadius: 5,
                }}
              >
                <View key={item.id} style={{ flex: 1 }}>
                  <Text
                    color={"#06202E"}
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                    fontSize={verticalScale(20)}
                  >
                    {item?.title}
                  </Text>
                  <Text
                    color={"PRIMARY_COLOR"}
                    fontFamily={Fonts.POPPINS_SEMI_BOLD}
                    fontSize={verticalScale(20)}
                    mt={2}
                  >
                    {item?.amount}{" "}
                    <Text
                      color={"#5A5A5C69"}
                      fontFamily={Fonts.POPPINS_REGULAR}
                    >
                      {t("per_month")}
                    </Text>
                  </Text>
                  <View
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    pl={horizontalScale(15)}
                    mt={verticalScale(10)}
                  >
                    <View flexDirection={"row"} alignItems="center">
                      <Avatar.Group
                        _avatar={{
                          size: "sm",
                        }}
                        max={3}
                      >
                        {[
                          "1494790108377-be9c29b29330",
                          "1603415526960-f7e0328c63b1",
                          "1607746882042-944635dfe10e",
                        ].map((item, index) => {
                          return (
                            <Avatar
                              key={index}
                              bg="green.500"
                              source={{
                                uri: `https://images.unsplash.com/photo-${item}?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`,
                              }}
                            >
                              AJ
                            </Avatar>
                          );
                        })}
                      </Avatar.Group>
                      <Text
                        color={"#5A5A5C"}
                        fontFamily={Fonts.POPPINS_MEDIUM}
                        ml={2}
                        fontSize={verticalScale(17)}
                      >
                        {item?.bcMembers?.length}/{item?.maxMembers}
                      </Text>
                    </View>
                    <Button
                      onPress={() => {
                        btn === "join" ? join(item.id) : details(item.id);
                      }}
                      size="sm"
                      variant={"solid"}
                      _pressed={{
                        backgroundColor: "DISABLED_COLOR",
                      }}
                      borderRadius={12}
                      _text={{
                        color: "WHITE_COLOR",
                        fontFamily: Fonts.POPPINS_MEDIUM,
                      }}
                      backgroundColor={"PRIMARY_COLOR"}
                      px={horizontalScale(30)}
                    >
                      {btn === "join" ? t("join") : t("details")}
                    </Button>
                  </View>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.PRIMARY_COLOR} />
        </View>
      )}
    </View>
  );
};

export default SeeAll;

const styles = StyleSheet.create({});
