import {
  StatusBar,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Text, View } from "native-base";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import Colors, { deepSkyBlue, newColorTheme } from "../../constants/Colors";
import { Fonts } from "../../constants";
import { apimiddleWare } from "../../utilities/helper-functions";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks/hooks";
import NotificationItem from "../../components/NotificationItem";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const getNotifications = async () => {
    setLoading(true);
    const response = await apimiddleWare({
      url: `/notifications/my`,
      method: "get",
      reduxDispatch: dispatch,
    });
    if (response) {
      setLoading(false);
      setNotifications(response);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getNotifications();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={newColorTheme.BACKGROUND_COLOR}
      />

      <Text style={styles.title}>{t("notification")}</Text>

      {loading ? (
        <View style={styles.centerCoontentContainer}>
          <ActivityIndicator size={"large"} color={Colors.PRIMARY_COLOR} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: verticalScale(30),
          }}
          keyExtractor={(item) => `${item.id}`}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={getNotifications}
              colors={[deepSkyBlue]}
            />
          }
          renderItem={({ item, index }) => (
            <NotificationItem notification={item} index={index} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.centerCoontentContainer}>
              <Text style={styles.emptyText}>
                {t("notification_not_found")}
              </Text>
            </View>
          )}
        />
      )}
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
  centerCoontentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: 16,
  },
  title: {
    marginTop: verticalScale(25),
    textAlign: "center",
    fontSize: verticalScale(22),
    color: "#06202E",
    fontFamily: Fonts.POPPINS_BOLD,
    fontWeight: 700,
  },
});

export default NotificationScreen;
