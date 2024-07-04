import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'native-base';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import { verticalScale } from '../../utilities/Dimensions';
import DragIcon from '../../assets/svg/dragIcon';
import { removeMembers, setMembers } from '../../redux/user/userSlice';
import { Member, RouteParams } from './AddMembers';

const Row = ({ active, data, index }: { active: boolean, data: Member, index: number }) => {
  const activeAnim = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    activeAnim.value = withTiming(active ? 1 : 0, {
      duration: 300,
      easing: Easing.bounce,
    });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: activeAnim.value * 0.07 + 1 }],
      ...(Platform.OS === 'ios' 
        ? { shadowRadius: activeAnim.value * 8 + 2 }
        : { elevation: activeAnim.value * 4 + 2 })
    };
  });

  const { balloting } = useRoute().params as RouteParams;
  const dispatch = useDispatch();
  const newMember = useSelector((state: any) => state.members);

  return (
    <Animated.View style={[styles.row, animatedStyle, { marginTop: verticalScale(10) }]}>
      <View>
        <DragIcon />
      </View>
      <View style={{ flexDirection: 'column', flex: 1, marginLeft: 10 }}>
        <View style={styles.memberContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0.5 }}>
            <Text style={styles.name}>
              {`${data.fullName} ${!balloting ? `(${index + 1})` : ''}`}
            </Text>
          </View>
          <TouchableOpacity
            style={{ marginRight: 5 }}
            onPress={() => {
              if (data.id) {
                dispatch(removeMembers(data.id));
              }
              const finalNew = newMember.filter((item: Member) => item.phone !== data.phone);
              dispatch(setMembers(finalNew));
            }}>
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

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    marginHorizontal: 2,
    marginVertical: verticalScale(10),
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 2,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: verticalScale(17),
  },
  desc: {
    color: '#888',
    fontFamily: 'Poppins-Medium',
  },
});

export default Row;
