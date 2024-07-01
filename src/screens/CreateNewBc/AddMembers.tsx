import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
  // Text,
  Platform,
  Easing,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  View,
  FormControl,
  Input,
  Box,
  Modal,
  Button,
  Avatar,
  Pressable,
  InputLeftAddon,
  InputGroup,
  Icon,
} from 'native-base';
import Heading from '../../components/Heading';
import {useNavigation, useRoute} from '@react-navigation/native';
import {horizontalScale, verticalScale} from '../../utilities/Dimensions';
import Colors, {newColorTheme} from '../../constants/Colors';
import SortableList from 'react-native-sortable-list';
import {useForm, Controller} from 'react-hook-form';
import {Fonts} from '../../constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  addMember,
  removeMember,
  setMembers,
  updateMembersOrder,
} from '../../redux/members/membersSlice';

import {removeMembers} from '../../redux/user/userSlice';
import DragIcon from '../../assets/svg/dragIcon';
import Del from '../../assets/svg/Del';
import Not_membersfound from '../../assets/svg/not_membersfound';
const AddMembers = () => {
  const navigation: any = useNavigation();
  const routes: any = useRoute();
  const {balloting, maxUsers} = routes.params;
  console.log({maxUsers: +maxUsers});
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [newMember, setNewMember] = useState<any>([]);
  const members = useSelector((state: any) => state.members);
  const removeArray = useSelector((state: any) => state.users.removeArray);

  const {
    control: addMembersControl,
    handleSubmit: handleAddMembersSubmit,
    formState: {errors: addMemberError},
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      // email: '',
      phone: '',
      openingPrecedence: 0,
    },
  });

  useEffect(() => {
    console.log({members});
    setNewMember(members);
  }, [members]);

  const addMemberHandler = (details: any) => {
    const obj = details;

    details.phone = `+92${details.phone}`;

    dispatch(addMember(details));
    reset({
      fullName: '',
      // email: '',
      phone: '',
      openingPrecedence: 0,
    });
    setOpenModal(false);
  };

  function Row(props: any) {
    const {active, data, index} = props;
    console.log({data});
    const activeAnim = useRef(new Animated.Value(0));
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
      [],
    );

    useEffect(() => {
      Animated.timing(activeAnim.current, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(active),
        useNativeDriver: true,
      }).start();
    }, [active]);

    return (
      <Animated.View
        style={[
          styles.row,
          style,
          {
            marginTop: verticalScale(10),
          },
        ]}>
        <View>
          <DragIcon />
        </View>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            marginLeft: 10,
          }}>
          <View style={styles.memberContainer}>
            <View flexDirection={'row'} alignItems={'center'} padding={0.5}>
              <Text style={styles.name}>{`${data.fullName}  ${
                !balloting ? `(${index + 1})` : ''
              }`}</Text>
            </View>
            <TouchableOpacity
              style={{marginRight: 5}}
              onPress={async () => {
                console.log({index});

                if (newMember[index].id) {
                  console.log({id_from_add: newMember[index].id});
                  dispatch(removeMembers(newMember[index].id));
                }

                const finalNew = newMember.filter((item: any) => {
                  console.log({new: newMember[index]});
                  console.log({dusra: data});

                  // return newMember[index] !== data;
                  return item.phone !== data.phone;
                });

                console.log({finalNew});
                dispatch(setMembers(finalNew));
              }}>
              <Del />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* <View>
              <Text style={styles.details}>Email</Text>
              <Text fontSize={'sm'} style={styles.desc}>
                {data?.email}
              </Text>
            </View> */}
            <View style={{overflow: 'hidden', marginRight: 5}}>
              {/* <Text style={styles.details}>Phone</Text> */}
              <Text fontSize={'sm'} style={styles.desc}>
                {data?.phone}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <View flex={1} bg={'BACKGROUND_COLOR'} px={horizontalScale(20)}>
      <StatusBar backgroundColor={newColorTheme.BACKGROUND_COLOR} />
      <Heading name={'Members'} navigation={navigation} />
      <Box mb={verticalScale(20)} mt={verticalScale(30)}>
        {!balloting && (
          <Text style={styles.details}>Drag to Arrange BC Opening Number</Text>
        )}
      </Box>
      <View flex={1} height={'100%'}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: members.length > 0 ? 'center' : 'flex-end',
            bottom: verticalScale(30),
            zIndex: 1,
          }}>
          <Button
            _text={{
              color: 'WHITE_COLOR',
              fontFamily: Fonts.POPPINS_SEMI_BOLD,
            }}
            _loading={{
              _text: {
                color: 'BLACK_COLOR',
                fontFamily: Fonts.POPPINS_MEDIUM,
              },
            }}
            _spinner={{
              color: 'BLACK_COLOR',
            }}
            _pressed={{
              backgroundColor: 'DISABLED_COLOR',
            }}
            disabled={+maxUsers == 0 || members.length == +maxUsers}
            style={{
              width: '100%', // Adjust the width as needed
              borderRadius: 10,
            }}
            // backgroundColor={Colors.PRIMARY_COLOR}
            backgroundColor={
              members.length == +maxUsers
                ? 'DISABLED_COLOR'
                : Colors.PRIMARY_COLOR
            }
            onPress={() => {
              setOpenModal(true);
            }}>
            Add New Member
          </Button>
        </View>
        {members.length > 0 ? (
          <SortableList
            data={members}
            sortingEnabled={!balloting}
            style={styles.list}
            contentContainerStyle={{
              paddingBottom: verticalScale(10),
            }}
            onChangeOrder={(nextOrder: any) => {
              console.log({nextOrder});
              let integerList = nextOrder.map((item: any) =>
                parseInt(item, 10),
              );
              console.log({integerList});
              let run = integerList.map((item: any, index: any) => {
                // members[item].openingPrecedence = index + 1;
                return members[item];
              });

              // dispatch(addMember(run));
              dispatch(updateMembersOrder(run));
              console.log({run});
            }}
            renderRow={({data, index, active}: any) => {
              // console.log({membersFromRow: members});
              // console.log(data);
              // console.log({length: members.length});
              // members[index].openingPrecedence = index + 1;

              console.log({data});

              return <Row data={data} active={active} index={index} />;
            }}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.8,
            }}>
            <Not_membersfound />
          </View>
        )}
      </View>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        backgroundColor={'rgba(0, 0, 0, 0.63)'}
        style={{
          flex: 1,
        }}>
        <Modal.Content
          style={{
            width: '85%', // Adjust the width as needed
            borderRadius: 10, // Adjust the border radius as needed
            marginBottom: verticalScale(50),
          }}>
          <Modal.CloseButton />
          <Modal.Header>
            <Text
              alignSelf="center"
              fontFamily={Fonts.POPPINS_BOLD}
              fontSize={'lg'}>
              Add Member
            </Text>
          </Modal.Header>
          <Modal.Body
            style={{
              width: '100%',
            }}>
            <FormControl>
              <FormControl.Label>Full Name</FormControl.Label>
              <Controller
                control={addMembersControl}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    placeholder={'Full Name'}
                    fontSize={'sm'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="fullName"
                rules={{
                  required: true,
                }}
                defaultValue=""
              />
              {addMemberError.fullName && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Full Name is required
                </Text>
              )}
            </FormControl>
            {/* <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Controller
                control={addMembersControl}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    fontSize={'sm'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    onChangeText={onChange}
                  />
                )}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                defaultValue=""
              />
              {addMemberError.email && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  {addMemberError.email.message}
                </Text>
              )}
            </FormControl> */}
            <FormControl>
              <FormControl.Label>Phone</FormControl.Label>
              <Controller
                control={addMembersControl}
                render={({field: {onChange, onBlur, value}}) => (
                  // <>
                  <InputGroup
                    style={{
                      flex: 1,
                    }}
                    w={{
                      base: '86%',
                      md: '285',
                    }}>
                    <InputLeftAddon children={'+92'} />
                    <Input
                      w={{
                        base: '100%',
                        md: '100%',
                      }}
                      placeholder={'3XZYYYYYYY'}
                      fontSize={'sm'}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="number-pad"
                      // style={{flex: 1, width: '100%'}}
                    />
                  </InputGroup>
                  // </>
                )}
                name="phone"
                rules={{
                  required: 'Phone Number must be 11 digit long',
                  minLength: 10,
                  maxLength: 10,
                }}
                defaultValue=""
              />

              {addMemberError.phone && (
                <Text
                  color={'ERROR'}
                  marginTop={verticalScale(5)}
                  fontFamily={Fonts.POPPINS_MEDIUM}>
                  Phone Number is required
                </Text>
              )}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button
              _text={{
                color: 'WHITE_COLOR',
                fontFamily: Fonts.POPPINS_SEMI_BOLD,
              }}
              _loading={{
                _text: {
                  color: 'BLACK_COLOR',
                  fontFamily: Fonts.POPPINS_MEDIUM,
                },
              }}
              _spinner={{
                color: 'BLACK_COLOR',
              }}
              _pressed={{
                backgroundColor: 'DISABLED_COLOR',
              }}
              style={{
                width: '100%', // Adjust the width as needed
                borderRadius: 10, // Adjust the border radius as needed
              }}
              backgroundColor={Colors.PRIMARY_COLOR}
              onPress={handleAddMembersSubmit(addMemberHandler)}>
              Add
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
