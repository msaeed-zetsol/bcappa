import { Avatar, Button, Text, View } from "native-base";
import { Fonts, Images } from "../constants";
import { StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { horizontalScale, verticalScale } from "../utilities/dimensions";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { capitalize, getBcStatusColor } from "../utilities/helper-functions";
import UpdateBc from "../assets/svg/UpdateBc.svg";
import { deepSkyBlue } from "../constants/Colors";

type BcCardProps = {
  bc: MyBc;
  currentUserId: string;
  onClickUpdate: (bc: MyBc) => void;
  onClickShare: (id: string) => void;
  onClickDetails: (id: string) => void;
};

const BcCard = ({
  bc,
  currentUserId,
  onClickUpdate,
  onClickShare,
  onClickDetails,
}: BcCardProps) => {
  const { t } = useTranslation();
  const statusColor = useMemo(() => getBcStatusColor(bc.status), [bc]);
  const numberformatter = useMemo(() => new Intl.NumberFormat(), []);

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusContainer,
            {
              borderColor: statusColor.color,
              backgroundColor: statusColor.backgroundColor,
            },
          ]}
        >
          <Text color={statusColor.color} fontFamily={Fonts.POPPINS_MEDIUM}>
            {capitalize(bc.status)}
          </Text>
        </View>

        {bc.type === "private" && bc.user.id === currentUserId && (
          <TouchableOpacity onPress={() => onClickUpdate(bc)}>
            <UpdateBc width={24} height={24} fill={deepSkyBlue} />
          </TouchableOpacity>
        )}

        {bc.type === "public" && bc.status === "pending" && (
          <TouchableOpacity onPress={() => onClickShare(bc.id)}>
            <Images.Send />
          </TouchableOpacity>
        )}
      </View>

      <View flexDirection={"row"} alignItems={"center"} mt={verticalScale(16)}>
        <Text style={styles.title}>{bc.title}</Text>

        {bc.type === "private" ? (
          <Images.RedLock
            width={horizontalScale(22)}
            height={verticalScale(20)}
          />
        ) : (
          <Images.Global
            width={horizontalScale(22)}
            height={verticalScale(20)}
          />
        )}
      </View>

      <Text
        color={"PRIMARY_COLOR"}
        fontFamily={Fonts.POPPINS_SEMI_BOLD}
        fontSize={verticalScale(20)}
        mt={1}
      >
        {numberformatter.format(bc.amount)}{" "}
        <Text color={"#5A5A5C69"} fontFamily={Fonts.POPPINS_REGULAR}>
          {t("per_month")}
        </Text>
      </Text>

      <View
        flexDirection={"row"}
        justifyContent={"space-between"}
        pl={horizontalScale(15)}
        mt={verticalScale(5)}
      >
        <View flexDirection={"row"} alignItems="center">
          <Avatar.Group
            _avatar={{
              size: "sm",
            }}
            max={3}
          >
            {bc.bcMembers.slice(0, 3).map((item, index) => {
              const uri = item.user.profileImg ?? "";
              if (uri !== "") {
                return (
                  <Avatar key={index} bg="green.500" source={{ uri: uri }}>
                    {item.user.fullName}
                  </Avatar>
                );
              } else {
                return <></>;
              }
            })}
          </Avatar.Group>

          <Text
            color={"#5A5A5C"}
            fontFamily={Fonts.POPPINS_MEDIUM}
            ml={2}
            fontSize={verticalScale(17)}
          >
            {bc.totalMembers}/{bc.maxMembers}
          </Text>
        </View>

        <Button
          onPress={() => onClickDetails(bc.id)}
          size="md"
          variant={"solid"}
          borderRadius={12}
          _text={{
            color: "WHITE_COLOR",
            fontFamily: Fonts.POPPINS_MEDIUM,
          }}
          _pressed={{
            backgroundColor: "DISABLED_COLOR",
          }}
          backgroundColor={"PRIMARY_COLOR"}
          px={horizontalScale(30)}
        >
          {t("details")}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: horizontalScale(20),
    borderRadius: 20,
    padding: verticalScale(16),
    marginTop: verticalScale(16),
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowRadius: 5,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: verticalScale(5),
    paddingHorizontal: verticalScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginEnd: horizontalScale(3),
    color: "#06202E",
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(20),
  },
});

export default BcCard;
