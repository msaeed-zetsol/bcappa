import { TouchableOpacity, Linking, ScrollView } from "react-native";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Text,
  View,
  FormControl,
  Input,
  Box,
  Pressable,
  Icon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { horizontalScale, verticalScale } from "../../utilities/dimensions";
import Colors, { wildWatermelon } from "../../constants/Colors";
import { useForm, Controller } from "react-hook-form";
import { Fonts } from "../../constants";
import ToggleSwitch from "toggle-switch-react-native";
import { BcSelectionType, BcType } from "../../types/Enums";
import TextFieldComponent from "../../components/TextFieldComponent";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { setMembers } from "../../redux/members/membersSlice";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import globalStyles from "../../styles/global";
import AppBar from "../../components/AppBar";
import useAxios from "../../hooks/useAxios";
import PrimaryButton from "../../components/PrimaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigators/stack-navigator/StackNavigator";
import ViewMembersButton from "../../components/ViewMembersButton";
import SecondaryButton from "../../components/SecondaryButton";
import { updateRefreshState } from "../../redux/refresh/refreshSlice";

type CreateBcScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateOrUpdateBcScreen"
>;

const CreateOrUpdateBcScreen = ({ route, navigation }: CreateBcScreenProps) => {
  const params = route.params;
  const isUpdatingBc = params.bc !== undefined;
  const numberformatter = useMemo(() => new Intl.NumberFormat(), []);
  const [loading, setLoading] = useState(false);
  const [bcTotal, setBcTotal] = useState("0");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const members = useAppSelector((state) => state.members);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isUpdatingBc) {
      const members: Member[] = params.bc?.bcMembers?.map((it) => {
        return {
          id: it.id,
          fullName: it.user.fullName,
          phone: it.user.phone,
          openingPrecedence: it.openingPrecedence,
        } as Member;
      });
      dispatch(setMembers(members));
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CreateBcFormValues>({
    defaultValues: {
      title: params.bc?.title ?? "",
      maxUsers: `${params.bc?.maxMembers ?? ""}`,
      amountPerMonth: `${params.bc?.amount ?? ""}`,
      startingDate: params.bc?.commenceDate
        ? new Date(params.bc?.commenceDate).toLocaleDateString()
        : "",
      isBalloting: params.bc?.selectionType === "auto",
    },
    reValidateMode: "onChange",
    mode: "onChange",
    criteriaMode: "firstError",
  });
  const maxUsers = watch("maxUsers");
  const amountPerMonth = watch("amountPerMonth");
  const isBalloting = watch("isBalloting");

  useEffect(() => {
    setBcTotal(
      numberformatter.format(+maxUsers * +amountPerMonth.replaceAll(",", ""))
    );
  }, [maxUsers, amountPerMonth]);

  const [createResponse, create] = useAxios<CreateBcResponse>("/bcs", "post");
  const [updateResponse, update] = useAxios(`/bcs/${params.bc?.id}`, "put");

  const formatAmountPerMonth = (amount: string) => {
    if (amount && amount !== "") {
      return numberformatter.format(+amount.replaceAll(",", ""));
    } else {
      return "";
    }
  };

  const createOrUpdateBc = (formValues: CreateBcFormValues) => {
    if (isBalloting) {
      members.map((it) => delete it.openingPrecedence);
    }

    const requestData = {
      title: formValues.title,
      type: BcType.Private,
      selectionType: isBalloting
        ? BcSelectionType.Auto
        : BcSelectionType.Manual,
      maxMembers: +formValues.maxUsers,
      amount: +formValues.amountPerMonth,
      bcMembers: members,
      commenceDate: selectedDate,
    };

    setLoading(true);
    if (isUpdatingBc) {
      abortControllerRef.current = update({
        data: requestData,
      });
    } else {
      abortControllerRef.current = create({
        data: requestData,
      });
    }
  };

  useEffect(() => {
    if (createResponse === null) {
      setLoading(false);
    }

    if (createResponse) {
      navigation.replace("BcCreatedScreen", { bcId: createResponse.id });
    }
  }, [createResponse]);

  useEffect(() => {
    if (updateResponse === null) {
      setLoading(false);
    }

    if (updateResponse) {
      dispatch(
        updateRefreshState({
          home: true,
          myBcs: true,
        })
      );
      navigation.goBack();
    }
  }, [updateResponse]);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      dispatch(setMembers([]));
    },
    []
  );

  return (
    <View flex={1} bg={"BACKGROUND_COLOR"} px={horizontalScale(20)}>
      <AppBar
        name={isUpdatingBc ? t("update_bc") : t("create_new_bc")}
        onPress={navigation.goBack}
      />
      <Box mt={verticalScale(40)}></Box>
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <FormControl w="100%">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Input
                  isDisabled={loading}
                  placeholder={t("title")}
                  w="100%"
                  size="lg"
                  borderRadius={16}
                  p="3"
                  pl="6"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  borderColor="BORDER_COLOR"
                  placeholderTextColor={"GREY"}
                  color={"BLACK_COLOR"}
                  fontFamily={Fonts.POPPINS_REGULAR}
                  fontSize={"sm"}
                  inputMode="text"
                />
              </View>
            )}
            name="title"
            rules={{
              required: t("title_is_required"),
            }}
          />
          {errors.title && (
            <Text style={globalStyles.errorText}>{t("title_is_required")}</Text>
          )}
          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    isDisabled={loading}
                    placeholder={t("max_users")}
                    w="100%"
                    size="lg"
                    borderRadius={16}
                    p="3"
                    pl="6"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    borderColor="BORDER_COLOR"
                    placeholderTextColor={"GREY"}
                    color={"BLACK_COLOR"}
                    fontFamily={Fonts.POPPINS_REGULAR}
                    fontSize={"sm"}
                  />
                </View>
              )}
              name="maxUsers"
              rules={{
                required: t("max_users_required"),
              }}
            />
            {errors.maxUsers && (
              <Text style={globalStyles.errorText}>
                {t("max_users_required")}
              </Text>
            )}
          </View>

          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    isDisabled={loading}
                    placeholder={t("amount_per_month")}
                    w="100%"
                    size="lg"
                    borderRadius={16}
                    p="3"
                    pl="6"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={formatAmountPerMonth(value)}
                    borderColor="BORDER_COLOR"
                    placeholderTextColor={"GREY"}
                    color={"BLACK_COLOR"}
                    fontFamily={Fonts.POPPINS_REGULAR}
                    fontSize={"sm"}
                  />
                </View>
              )}
              name="amountPerMonth"
              rules={{
                required: t("amount_per_month_required"),
              }}
            />
            {errors.amountPerMonth && (
              <Text style={globalStyles.errorText}>
                {t("amount_per_month_required")}
              </Text>
            )}
          </View>

          <View mt={verticalScale(15)}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TouchableOpacity onPress={() => setShowDatePickerModal(true)}>
                  <TextFieldComponent
                    isDisabled={loading}
                    placeholder={t("starting_date")}
                    value={value}
                    readOnly={true}
                    InputRightElement={
                      <Pressable onPress={() => setShowDatePickerModal(true)}>
                        <Icon
                          as={<Ionicons name={"calendar"} />}
                          size={5}
                          mr="5"
                          color="muted.400"
                        />
                      </Pressable>
                    }
                  />
                </TouchableOpacity>
              )}
              name="startingDate"
              rules={{
                required: t("starting_date_required"),
              }}
            />
            {errors.startingDate && (
              <Text style={globalStyles.errorText}>
                {errors.startingDate.message}
              </Text>
            )}
          </View>

          <Text
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            mt={verticalScale(10)}
            fontSize={"sm"}
            color={"GREY"}
          >
            {t("total_expected_bc_amount")}
            {": "}
            <Text color={"PRIMARY_COLOR"} fontFamily={Fonts.POPPINS_SEMI_BOLD}>
              {bcTotal}
            </Text>
          </Text>
        </FormControl>
        <View
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={verticalScale(35)}
        >
          <Text fontFamily={Fonts.POPPINS_SEMI_BOLD} fontSize={"lg"}>
            {t("bc_balloting")}
          </Text>
          <View>
            <ToggleSwitch
              disabled={loading}
              isOn={isBalloting}
              onColor={Colors.PRIMARY_COLOR}
              offColor={Colors.GREY}
              label={isBalloting ? "Auto" : "Manual"}
              labelStyle={{
                color: Colors.GREY,
                fontFamily: Fonts.POPPINS_SEMI_BOLD,
              }}
              size="medium"
              onToggle={async () => {
                setValue("isBalloting", !isBalloting);
              }}
              thumbOffStyle={{
                backgroundColor: Colors.WHITE_COLOR,
              }}
              thumbOnStyle={{
                backgroundColor: Colors.WHITE_COLOR,
              }}
            />
          </View>
        </View>

        {showDatePickerModal && (
          <DateTimePicker
            value={selectedDate}
            mode={"date"}
            display="default"
            minimumDate={new Date()}
            onChange={(event: DateTimePickerEvent, date?: Date) => {
              setShowDatePickerModal(false);
              if (date && event.type === "set") {
                setValue("startingDate", date.toLocaleDateString(), {
                  shouldValidate: true,
                });
                setSelectedDate(date);
              }
            }}
            style={{ flex: 1, backgroundColor: "red" }}
            positiveButton={{ label: t("ok"), textColor: Colors.PRIMARY_COLOR }}
            negativeButton={{
              label: t("cancel"),
              textColor: Colors.PRIMARY_COLOR,
            }}
          />
        )}

        <View
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mt={verticalScale(30)}
        >
          <Text fontFamily={Fonts.POPPINS_SEMI_BOLD} fontSize={"lg"}>
            {t("members")}
          </Text>
        </View>

        <ViewMembersButton
          isCreatingBc={loading}
          maxUsers={maxUsers}
          membersLength={members.length}
          onClick={() => {
            navigation.navigate("AddUpdateMembersScreen", {
              bcId: params.bc?.id ?? "",
              isBalloting: isBalloting,
              maxUsers: +maxUsers,
              updatingBc: isUpdatingBc,
            });
          }}
          style={{
            marginTop: verticalScale(10),
          }}
        />

        <View
          justifyContent={"flex-end"}
          mb={verticalScale(10)}
          mt={verticalScale(10)}
        >
          <Text
            color={Colors.BLACK_COLOR}
            fontFamily={Fonts.POPPINS_SEMI_BOLD}
            my={verticalScale(5)}
            fontSize={"md"}
          >
            {t("dont_know_how_to_add")}
          </Text>

          <SecondaryButton
            text={t("call_our_helpline")}
            isDisabled={false}
            isLoading={false}
            onClick={() => Linking.openURL(`tel:03163110456`)}
            color={wildWatermelon}
            props={{ mb: verticalScale(10) }}
          />
          <PrimaryButton
            text={isUpdatingBc ? t("update") : t("create")}
            isDisabled={
              !isValid || members.length < 1 || members.length > +maxUsers
            }
            isLoading={loading}
            onClick={handleSubmit(createOrUpdateBc)}
            props={{
              mt: verticalScale(10),
              mb: verticalScale(10),
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateOrUpdateBcScreen;
