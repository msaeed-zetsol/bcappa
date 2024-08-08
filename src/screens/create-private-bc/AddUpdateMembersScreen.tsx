import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Text,
  Box,
  Modal,
  FormControl,
  Pressable,
  Icon,
  View,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { verticalScale } from "../../utilities/dimensions";
import { newColorTheme } from "../../constants/Colors";
import { Fonts, Images } from "../../constants";
import { useTranslation } from "react-i18next";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import MemberListItem from "../../components/MemberListItem";
import { setMembers } from "../../redux/members/membersSlice";
import { store } from "../../redux/store";
import { useAppDispatch } from "../../hooks/hooks";
import AppBar from "../../components/AppBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators/stack-navigator/StackNavigator";
import useAxios from "../../hooks/useAxios";
import PrimaryButton from "../../components/PrimaryButton";
import globalStyles from "../../styles/global";
import CountryCodePicker from "../../components/CountryCodePicker";
import TextFieldComponent from "../../components/TextFieldComponent";

type AddUpdateMembersScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AddUpdateMembersScreen"
>;

const AddUpdateMembersScreen = ({
  route,
  navigation,
}: AddUpdateMembersScreenProps) => {
  const { bcId, isBalloting, maxUsers, updatingBc } = route.params;
  const [openModal, setOpenModal] = useState(false);
  const [members, updateMembers] = useState<Member[]>(store.getState().members);
  const [countryCode, setCountryCode] = useState("+92");
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const membersRef = useRef<Member[]>(members);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm<Member>({
    defaultValues: {
      fullName: "",
      phone: "",
      openingPrecedence: 0,
    },
    reValidateMode: "onChange",
    mode: "onChange",
    criteriaMode: "firstError",
  });

  const [_, remove] = useAxios("/bcs/private/remove-members", "delete");
  const abortControllerRef = useRef<AbortController | null>(null);

  const removeBcMember = async (member: Member) => {
    abortControllerRef.current = remove({
      data: {
        bcId: bcId,
        membersId: [member.id],
      },
    });
  };

  const renderItem = ({ item, getIndex, drag }: RenderItemParams<Member>) => (
    <MemberListItem
      index={getIndex() ?? 0}
      member={item}
      isBalloting={isBalloting}
      onPressIn={drag}
      onDelete={(item) => {
        updateMembers(members.filter((it) => it.phone !== item.phone));
        if (updatingBc) {
          removeBcMember(item);
        }
      }}
    />
  );

  const addMemberHandler = (details: Member) => {
    const duplicate = members.find(
      (it) => it.phone === `${countryCode}${details.phone}`
    );
    if (duplicate) {
      setError("phone", {
        message: "It looks like this phone number is already in use.",
      });
    } else {
      details.openingPrecedence = members.length + 1;
      details.phone = `${countryCode}${details.phone}`;
      updateMembers((it) => [...it, details]);
      reset();
      setOpenModal(false);
    }
  };

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      dispatch(
        setMembers(
          membersRef.current.map((member, index) => {
            return { ...member, openingPrecedence: index + 1 };
          })
        )
      );
    },
    []
  );

  return (
    <View style={styles.container}>
      <AppBar name={t("members")} onPress={navigation.goBack} />

      <Box mb={verticalScale(10)} mt={verticalScale(30)}>
        {!isBalloting && (
          <Text style={styles.details}>
            {t("drag_to_arrange_bc_opening_number")}
          </Text>
        )}
      </Box>

      <CountryCodePicker
        visible={showCountryCodePicker}
        onDismiss={() => setShowCountryCodePicker(false)}
        onPicked={(item) => {
          setCountryCode(item.dial_code);
          setShowCountryCodePicker(false);
        }}
      />

      <View style={{ flex: 1 }}>
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
          <PrimaryButton
            text={t("add_new_member")}
            isDisabled={
              members.length === maxUsers || maxUsers < members.length
            }
            isLoading={false}
            onClick={() => setOpenModal(true)}
            props={{ style: { width: "100%" } }}
          />
        </View>

        <DraggableFlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={(item: Member) => `${item.openingPrecedence}`}
          onDragEnd={({ data }) => updateMembers(data)}
          activationDistance={0}
          containerStyle={{ flexGrow: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: verticalScale(100),
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <Images.Not_Members_Found />
              </View>
            );
          }}
        />
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
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextFieldComponent
                    isDisabled={false}
                    placeholder={t("full_name")}
                    onBlur={onBlur}
                    onChange={onChange}
                    keyboardType={"ascii-capable"}
                    value={value}
                  />
                )}
                name="fullName"
                rules={{
                  required: t("full_name_is_required"),
                }}
                defaultValue=""
              />
              {errors.fullName && (
                <Text style={globalStyles.errorText}>
                  {t("full_name_is_required")}
                </Text>
              )}
            </FormControl>
            <FormControl style={{ marginTop: verticalScale(16) }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextFieldComponent
                    isDisabled={false}
                    placeholder={t("phone_number")}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    maxLength={10}
                    keyboardType={"number-pad"}
                    InputLeftElement={
                      <Pressable
                        isDisabled={false}
                        onPress={() => setShowCountryCodePicker(true)}
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        ml="3"
                      >
                        <Text
                          fontSize={"sm"}
                          fontFamily={Fonts.POPPINS_REGULAR}
                        >
                          {countryCode}
                        </Text>
                        <Icon
                          as={<Ionicons name={"caret-down"} />}
                          size={3}
                          ml="2"
                          color="BLACK_COLOR"
                        />
                        <View
                          borderWidth={0.5}
                          borderColor={"BORDER_COLOR"}
                          height={5}
                          ml={2}
                        />
                      </Pressable>
                    }
                  />
                )}
                name="phone"
                rules={{
                  required: t("phone_is_invalid"),
                  minLength: {
                    value: 10,
                    message: t("phone_is_invalid"),
                  },
                }}
                defaultValue=""
              />
              {errors.phone && (
                <Text style={globalStyles.errorText}>
                  {errors.phone?.message}
                </Text>
              )}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <PrimaryButton
              text={t("add")}
              isDisabled={!isValid}
              isLoading={false}
              onClick={handleSubmit(addMemberHandler)}
              props={{ width: "100%" }}
            />
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: newColorTheme.BACKGROUND_COLOR,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 22,
    color: "#222222",
  },
  details: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(15),
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddUpdateMembersScreen;
