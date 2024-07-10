import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, TouchableOpacity, View, Platform } from 'react-native';
import { Text, Box, Modal, Button, FormControl, Input, InputLeftAddon, InputGroup } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Animated, { useSharedValue, useAnimatedStyle, Easing, interpolate, Extrapolate, runOnJS } from 'react-native-reanimated';
import { addMember, removeMember, setMembers, updateMembersOrder } from '../../redux/members/membersSlice';
import { removeMembers } from '../../redux/user/userSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { horizontalScale, verticalScale } from '../../utilities/Dimensions';
import Colors, { newColorTheme } from '../../constants/Colors';
import { Fonts } from '../../constants';
import Heading from '../../components/Heading';
import { useTranslation } from "react-i18next";
import { Images } from '../../constants';
import { withTiming } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

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
  const navigation = useNavigation();
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

  const Select = () => {
    'worklet';
    console.log('Executing myNonWorkletFunction');
  };

  const addMemberHandler = (details: any) => {
    details.phone = `+92${details.phone}`;
    dispatch(addMember(details));
    reset();
    setOpenModal(false);
    runOnJS(Select)();
  };

  const onDragEnd = ({ data }: { data: Member[] }) => {
    let updatedMembers = data.map((item, index) => ({
      ...item,
      openingPrecedence: index + 1,
    }));
    dispatch(updateMembersOrder(updatedMembers));
  };

  const renderItem = ({ item, drag, isActive, index }: any) => (
    <PanGestureHandler onGestureEvent={drag}>
      <Animated.View>
        <Row data={item} index={index} active={isActive} style={[styles.row, isActive && { backgroundColor: 'lightgrey' }]} />
      </Animated.View>
    </PanGestureHandler>
  );


  function Row(props: any) {
    const { active, data, index } = props;
    const activeAnim = useSharedValue(0);

    useEffect(() => {
      activeAnim.value = withTiming(active ? 1 : 0, { duration: 300, easing: Easing.bounce });
    }, [active]);

    const style = useAnimatedStyle(() => {
      const scale = interpolate(activeAnim.value, [0, 1], [1, 1], Extrapolate.CLAMP);
      const shadowRadius = interpolate(activeAnim.value, [0, 1], [2, 10], Extrapolate.CLAMP);
      const elevation = interpolate(activeAnim.value, [0, 1], [2, 6], Extrapolate.CLAMP);

      return (
        Platform.OS === 'ios'
          ? { transform: [{ scale }], shadowRadius }
          : { transform: [{ scale }], elevation }
      );
    });
    return (
      <Animated.View style={[styles.row, style, { marginTop: verticalScale(10) }]}>
        <View>
          <Images.DragIcon />
        </View>
        <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10 }}>
          <View style={styles.memberContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0.5 }}>
              <Text style={styles.name}>{`${data.fullName} ${!balloting ? `(${members.indexOf(data)})` : ''} `}</Text>
            </View>
            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={() => {
                if (data.id) {
                  runOnJS(dispatch)(removeMembers(data.id));
                }
                const finalNew = newMember.filter((item) => item.phone !== data.phone);
                runOnJS(dispatch)(setMembers(finalNew));
              }}
            >
              <MaterialIcons name="close" size={25} color="red" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ overflow: 'hidden', marginRight: 5 }}>
              <Text fontSize={'sm'} style={styles.desc}>
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
      <Heading name={t("members")} onPress={navigation.goBack} />
      <Box mb={verticalScale(20)} mt={verticalScale(30)}>
        {!balloting && (
          <Text style={styles.details}>Drag to Arrange BC Opening Number</Text>
        )}
      </Box>
      <View style={{ flex: 1, height: '100%' }}>
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
          <DraggableFlatList
            data={newMember}
            renderItem={renderItem}
            keyExtractor={(item: Member, id) => `${item.phone} ${id}`}
            onDragEnd={onDragEnd}
          />
        ) : (
          <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 0.8 }}>
            <Images.Not_Members_Found />
          </View>
        )}
      </View>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        backgroundColor={'rgba(0, 0, 0, 0.63)'}
        style={{ flex: 1 }}>
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
          <Modal.Body style={{ width: '100%' }}>
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
                  <InputGroup style={{ flex: 1 }} w={{ base: '86%', md: '285' }}>
                    <InputLeftAddon children={'+92'} />
                    <Input
                      w={{ base: '100%', md: '100%' }}
                      placeholder={'3XZYYYYYYY'}
                      fontSize={'sm'}
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
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
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
  },
  details: {
    fontFamily: Fonts.POPPINS_MEDIUM,
    fontSize: verticalScale(15),
  },
  desc: {
    color: Colors.GREY,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(80)
  }
});
