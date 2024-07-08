import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Platform,
  Easing,
  View,
} from 'react-native';
import {
  Text,
  Box,
  Modal,
  Button,
  FormControl,
  Input,
  InputLeftAddon,
  InputGroup,
} from 'native-base';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import DraggableFlatList from 'react-native-draggable-flatlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Colors, {newColorTheme} from '../../constants/Colors';
import {Fonts} from '../../constants';
import Heading from '../../components/Heading';
import {Images} from '../../constants';
import {
  addMember,
  removeMember,
  setMembers,
  updateMembersOrder,
} from '../../redux/members/membersSlice';
import {removeMembers} from '../../redux/user/userSlice';
import { useTranslation } from "react-i18next";

type Member = {
  id: any;
  fullName: string;
  phone: string;
  openingPrecedence: number;
};

type RouteParams = {
  balloting: boolean;
  maxUsers: number;
};

const AddMembers: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { balloting, maxUsers } = route.params as RouteParams;
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [newMember, setNewMember] = useState<Member[]>([]);
  const members = useSelector((state: any) => state.members);
  const removeArray = useSelector((state: any) => state.users.removeArray);
  const { t } = useTranslation();

  const {
    control: addMembersControl,
    handleSubmit: handleAddMembersSubmit,
    formState: { errors: addMemberError },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      openingPrecedence: 0,
    },
  });

  useEffect(() => {
    setNewMember(members);
    console.log("newMember", members);
  }, [members]);

  const addMemberHandler = (details: any) => {
    details.phone = `+92${details.phone}`;
    dispatch(addMember(details));
    reset();
    setOpenModal(false);
  };

  const onDragEnd = ({ data }: { data: Member[] }) => {
    let run = data.map((item, index) => {
      item.openingPrecedence = index + 1;
      return item;
    });
    dispatch(updateMembersOrder(run));
  };

  const renderItem = ({ item, index, drag, isActive }: any) => {
    return <Row data={item} active={isActive} index={index} />;
  };

  const Row = ({ active, data, index }: any) => {
    const activeAnim = useRef(new Animated.Value(0));

    useEffect(() => {
      Animated.timing(activeAnim.current, {
        duration: 300,
        easing: Easing.bounce,
        toValue: active ? 1 : 0,
        useNativeDriver: true,
      }).start();
      console.log("active", active);
    }, [active]);

    const style = useMemo(
      () => ({
        ...Platform.select({
          ios: {
            transform: [
              {
                scale: activeAnim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.07],
                }),
              },
            ],
            shadowRadius: activeAnim.current.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 10],
            }),
          },
          android: {
            transform: [
              {
                scale: activeAnim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.07],
                }),
              },
            ],
            elevation: activeAnim.current.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 6],
            }),
          },
        }),
      }),
      []
    );

    const { balloting } = useRoute().params as RouteParams;
    const dispatch = useDispatch();
    const newMember = useSelector((state: any) => state.members);

    return (
      <Animated.View
        style={[styles.row, style, { marginTop: verticalScale(10) }]}
      >
        <View>
          <Images.DragIcon />
        </View>
        <View style={{ flexDirection: "column", flex: 1, marginLeft: 10 }}>
          <View style={styles.memberContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 0.5,
              }}
            >
              <Text style={styles.name}>
                {`${data.fullName} ${!balloting ? `(${index + 1})` : ""}`}
              </Text>
            </View>
            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={() => {
                if (data.id) {
                  dispatch(removeMembers(data.id));
                }
                const finalNew = newMember.filter(
                  (item: Member) => item.phone !== data.phone
                );
                dispatch(setMembers(finalNew));
              }}
            >
              <MaterialIcons name="close" size={25} color="red" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ overflow: "hidden", marginRight: 5 }}>
              <Text fontSize={"sm"} style={styles.desc}>
                {data?.phone}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: newColorTheme.BACKGROUND_COLOR,
        paddingHorizontal: horizontalScale(20),
      }}
    >
      <StatusBar backgroundColor={newColorTheme.BACKGROUND_COLOR} />
      <Heading name={"Members"} navigation={navigation} />
      <Box mb={verticalScale(20)} mt={verticalScale(30)}>
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
          <GestureHandlerRootView>
            <DraggableFlatList
              data={members}
              onDragEnd={onDragEnd}
              keyExtractor={(item, index) => `${item.phone}-${index}`}
              renderItem={renderItem}
              style={styles.list}
              contentContainerStyle={{ paddingBottom: verticalScale(10) }}
              dragItemOverflow
            />
          </GestureHandlerRootView>
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
                control={addMembersControl}
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
              {addMemberError.fullName && (
                <Text
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
                control={addMembersControl}
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
              {addMemberError.phone && (
                <Text
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
              onPress={handleAddMembersSubmit(addMemberHandler)}
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
  btnContainer: {
    backgroundColor: '#F0FAFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: verticalScale(15),
    borderRadius: 15,
    marginVertical: verticalScale(10),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },
  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: '#999999',
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: horizontalScale(10),
  },
  row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    marginHorizontal: horizontalScale(2),
    // height: 100,
    marginVertical: verticalScale(10),
    // flex: 1,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        // width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },
      android: {
        // width: window.width - 30 * 2,
        elevation: 12,
        // marginHorizontal: 30,
      },
    }),
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },
  text: {
    fontSize: 22,
    color: '#222222',
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    fontSize: verticalScale(17),
    // marginLeft: horizontalScale(5),
  },
  details: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(15),
  },
  desc: {
    color: Colors.GREY,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
});
