import {
  StyleSheet,
  StatusBar,
  FlatList,
  Share,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import { Fonts } from "../../constants";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Colors, { deepSkyBlue, newColorTheme } from "../../constants/Colors";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import useAxios from "../../hooks/useAxios";
import AddFloatingActionButton from "../../components/AddFloatingActionButton";
import BcCard from "../../components/BcCard";

const MyBcsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const { t } = useTranslation();
  const dynamicLink = useRef<string | null>(null);

  const shareDynamicLink = (id: string) => {
    buildLink(id).then((link) => {
      Share.share({ message: link });
    });
  };

  const buildLink: (id: string) => Promise<string> = async (id: string) => {
    if (dynamicLink.current === null) {
      dynamicLink.current = await dynamicLinks().buildShortLink(
        {
          link: `https://invertase.io/offer?id=${id}`,
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
    }
    return dynamicLink.current;
  };

  const navigateToUpdateBc = (bc: MyBc) => {
    navigation.dispatch(
      CommonActions.navigate("CreateOrUpdateBcScreen", {
        bc: bc,
      })
    );
  };

  const navigateToDetails = (id: string) => {
    navigation.dispatch(
      CommonActions.navigate("BcDetailsScreen", {
        item: id,
        deeplink: false,
      })
    );
  };

  const navigateToCreateBcScreen = () =>
    navigation.dispatch(
      CommonActions.navigate("CreateOrUpdateBcScreen", { bc: undefined })
    );

  const [response, start] = useAxios<MyBcsResponse>("/bcs/my", "get");
  const abortControllerRef = useRef<AbortController | null>(null);

  const getMyBcs = async () => {
    setLoading(true);
    AsyncStorage.getItem("loginUserData").then((it) => {
      if (it) {
        setUser(JSON.parse(it));
      }
    });
    abortControllerRef.current = start();
  };

  useEffect(() => {
    if (response !== undefined) {
      setLoading(false);
    }
  }, [response]);

  useEffect(() => {
    getMyBcs();
    return () => abortControllerRef.current?.abort();
  }, []);

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} pt={verticalScale(15)}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />

      <View
        mt={verticalScale(16)}
        mb={verticalScale(16)}
        mx={horizontalScale(20)}
      >
        <Text style={styles.title}>{t("my_bcs")}</Text>
      </View>

      <AddFloatingActionButton onClick={navigateToCreateBcScreen} />

      {response === undefined && (
        <View style={styles.container}>
          <ActivityIndicator size={"large"} color={Colors.PRIMARY_COLOR} />
        </View>
      )}

      {response && (
        <FlatList
          data={response}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: verticalScale(100),
            flexGrow: 1,
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <BcCard
                bc={item}
                currentUserId={user?.id ?? ""}
                onClickShare={shareDynamicLink}
                onClickUpdate={navigateToUpdateBc}
                onClickDetails={navigateToDetails}
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={getMyBcs}
              colors={[deepSkyBlue]}
            />
          }
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyTextContainer}>
                <Text
                  style={{
                    fontSize: verticalScale(20),
                    fontFamily: Fonts.POPPINS_BOLD,
                  }}
                >
                  {t("no_bc_found")}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: verticalScale(22),
    color: "#06202E",
    letterSpacing: 0.2,
    fontFamily: Fonts.POPPINS_BOLD,
  },
  emptyTextContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
});

export default MyBcsScreen;
