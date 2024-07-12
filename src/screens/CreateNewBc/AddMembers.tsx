import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import {
  Text,
  Box,
  Modal,
  Button,
  FormControl,
  Input,
  InputLeftAddon,
  InputGroup,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { verticalScale } from "../../utilities/Dimensions";
import Colors, { newColorTheme } from "../../constants/Colors";
import { Fonts, Images } from "../../constants";
import Heading from "../../components/Heading";
import { useTranslation } from "react-i18next";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import MemberListItem from "../../components/MemberListItem";
import { setMembers } from "../../redux/members/membersSlice";
import { store } from "../../redux/store";
import { useAppDispatch } from "../../hooks/hooks";

type RouteParams = {
  balloting: boolean;
  maxUsers: number;
};

const AddMembers = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { balloting, maxUsers } = route.params as RouteParams;
  const [openModal, setOpenModal] = useState(false);
  const [members, updateMembers] = useState<Member[]>(store.getState().members);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Member>({
    defaultValues: {
      fullName: "",
      phone: "",
      openingPrecedence: 0,
    },
  });

  const renderItem = ({ item, getIndex, drag }: RenderItemParams<Member>) => (
    <MemberListItem
      index={getIndex() ?? 0}
      member={item}
      onPressIn={drag}
      onDelete={(precedence) => {
        updateMembers(
          members.filter((member) => member.openingPrecedence !== precedence)
        );
      }}
    />
  );

  const addMemberHandler = (details: Member) => {
    details.openingPrecedence = members.length + 1;
    details.phone = `+92${details.phone}`;
    updateMembers([...members, details]);
    reset();
    setOpenModal(false);
  };

  useEffect(
    () => () => {
      console.log("saving members");
      dispatch(
        setMembers(
          members.map((member, index) => {
            return { ...member, openingPrecedence: index + 1 };
          })
        )
      );
    },
    [members]
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: newColorTheme.BACKGROUND_COLOR,
        paddingHorizontal: 24,
      }}
    >
      <StatusBar backgroundColor={newColorTheme.BACKGROUND_COLOR} />

      <Heading name={t("members")} onPress={navigation.goBack} />

      <Box mb={verticalScale(10)} mt={verticalScale(30)}>
        {!balloting && (
          <Text style={styles.details}>Drag to Arrange BC Opening Number</Text>
        )}
      </Box>

      <View style={{ flex: 1, height: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            position: "absolute",
            alignItems: "center",
            justifyContent: members.length > 0 ? "center" : "flex-end",
            bottom: verticalScale(30),
            zIndex: 1,
          }}
        >
          <Button
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
            disabled={+maxUsers === 0 || members.length === +maxUsers}
            style={{
              width: "100%",
              borderRadius: 10,
              height: 66,
            }}
            backgroundColor={
              members.length === +maxUsers
                ? "DISABLED_COLOR"
                : Colors.PRIMARY_COLOR
            }
            onPress={() => {
              setOpenModal(true);
            }}
          >
            {t("add_new_member")}
          </Button>
        </View>

        {members.length > 0 ? (
          <DraggableFlatList
            data={members}
            renderItem={renderItem}
            keyExtractor={(item: Member) => `${item.openingPrecedence}`}
            onDragEnd={({ data }) => updateMembers(data)}
            activationDistance={0}
          />
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 0.8,
            }}
          >
            <Images.Not_Members_Found />
          </View>
        )}
      </View>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        backgroundColor={"rgba(0, 0, 0, 0.63)"}
        style={{ flex: 1 }}
      >
        <Modal.Content
          style={{
            width: "85%",
            borderRadius: 10,
            marginBottom: verticalScale(50),
          }}
        >
          <Modal.CloseButton />
          <Modal.Header>
            <Text
              alignSelf="center"
              fontFamily={Fonts.POPPINS_BOLD}
              fontSize={"lg"}
            >
              {t("add_member")}
            </Text>
          </Modal.Header>
          <Modal.Body style={{ width: "100%" }}>
            <FormControl>
              <FormControl.Label>Full Name</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder={t("full_name")}
                    fontSize={"sm"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="fullName"
                rules={{ required: true }}
                defaultValue=""
              />
              {errors.fullName && (
                <Text
                  style={{ fontSize: 13 }}
                  color={"ERROR"}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}
                >
                  {t("full_name_is_required")}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <FormControl.Label>{t("phone_captialized")}</FormControl.Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputGroup
                    style={{ flex: 1 }}
                    w={{ base: "86%", md: "285" }}
                  >
                    <InputLeftAddon children={"+92"} />
                    <Input
                      w={{ base: "100%", md: "100%" }}
                      placeholder={"3XZYYYYYYY"}
                      fontSize={"sm"}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="number-pad"
                    />
                  </InputGroup>
                )}
                name="phone"
                rules={{
                  required: t("phone_is_invalid"),
                  minLength: 10,
                  maxLength: 10,
                }}
                defaultValue=""
              />
              {errors.phone && (
                <Text
                  style={{ fontSize: 13 }}
                  color={"ERROR"}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}
                >
                  {t("phone_is_required")}
                </Text>
              )}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button
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
              style={{
                width: "100%",
                borderRadius: 10,
              }}
              backgroundColor={Colors.PRIMARY_COLOR}
              onPress={handleSubmit(addMemberHandler)}
            >
              {t("add")}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default AddMembers;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: "#222222",
  },
  details: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(15),
  },
});
